import { CommandManager } from 'gugle-command';
import { EventManager } from 'gugle-event';

class Plugin {
  public constructor() {
    // ...
  }
}

class PluginManager {
  public readonly plugins: Plugin[] = [];
  public readonly bot: BlackBoxBot;

  public constructor(bot: BlackBoxBot) {
    this.bot = bot;
  }

  public registerPlugin(plugin: Plugin): PluginManager {
    this.plugins.push(plugin);
    return this;
  }
}

export class BlackBoxBot {
  private static instance: BlackBoxBot;
  private readonly commandManager: CommandManager;
  private readonly eventManager: EventManager;
  private readonly pluginManager: PluginManager;

  private constructor() {
    this.commandManager = new CommandManager();
    this.eventManager = new EventManager();
    this.pluginManager = new PluginManager(this);
  }

  public static getInstance(): BlackBoxBot {
    if (!BlackBoxBot.instance) {
      BlackBoxBot.instance = new BlackBoxBot();
    }
    return BlackBoxBot.instance;
  }

  public async start(): Promise<void> {
    // ...
  }

  public static registerPlugin(plugin: Plugin, isSingle: boolean = true): BlackBoxBot {
    const bot = isSingle ? BlackBoxBot.getInstance() : new BlackBoxBot();
    bot.pluginManager.registerPlugin(plugin);
    return bot;
  }

  public stop(): void {
    // ...
  }

  /**
   * @useage @bot.command('/test command {arg0: NUMBER} run {arg1: STRING} set {arg2: BOOLEAN}')
   *         function testCommand(arg0: number, arg1: string, arg2: boolean) {}
   */
  public command(namespace: string, command: string): Function {
    const self = this;
    return function (executor: Function) {
      if (!command.startsWith(self.commandManager.prefix)) {
        throw new Error('Invalid command');
      }
      const commands = command.substring(self.commandManager.prefix.length);
      const nodes = commands.split(' ');
      if (nodes.length <= 0) {
        throw new Error('Invalid command');
      }
      let root = undefined;
      for (const node of nodes) {
        if (!root) {
          if (node.startsWith('{') || node.endsWith('}')) {
            throw new Error('Invalid command, root node can not be argument node!');
          }
          root = self.commandManager.literal(node);
        }
      }
      self.commandManager.register(namespace, root!);
    };
  }

  /**
   * @useage @BlackBoxBot.command('/test command {arg0: NUMBER} run {arg1: STRING} set {arg2: BOOLEAN}')
   *         function testCommand(arg0: number, arg1: string, arg2: boolean) {}
   */
  public static command(namespace: string, command: string): Function {
    return BlackBoxBot.getInstance().command(namespace, command);
  }
}
