import { CommandManager } from 'gugle-command';
import { EventManager } from 'gugle-event';
import * as process from 'node:process';
import fs from 'fs';
import { Arguments, CommandNode } from 'gugle-command/src';

export class Constants {
  public static readonly pluginPath = 'plugins';
}

class CustomCommandManager extends CommandManager {
  public constructor() {
    super();
  }

  private static checkCharacters(chars: string): boolean {
    const reg = /^[a-z]+[a-z0-9_-]*$/;
    return reg.test(chars);
  }

  public static parseArgument(argument: string): (arg: string) => any {
    switch (argument.trim()) {
      case 'NUMBER':
        return Arguments.NUMBER;
      case 'STRING':
        return Arguments.STRING;
      case 'BOOLEAN':
        return Arguments.BOOLEAN;
      default:
        throw new Error('Not implemented');
    }
  }

  public static parseNode(node: string): CommandNode {
    if (node.startsWith('{') && node.endsWith('}')) {
      const nodes: string[] = node.substring(1, node.length - 1).split(':');
      return CommandManager.argument(nodes[0], CustomCommandManager.parseArgument(nodes[1]));
    } else {
      if (CustomCommandManager.checkCharacters(node)) {
        return CommandManager.literal(node);
      }
    }
    throw new Error('Not implemented');
  }
}

class Plugin {
  private readonly single: boolean;

  public constructor(single: boolean = false) {
    this.single = single;
  }

  public isSingle(): boolean {
    return this.single;
  }
}

class PluginManager {
  public rootDirectory: string = process.cwd();
  public readonly plugins: Plugin[] = [];
  public readonly bot: HeyBoxBot;
  private readonly single: boolean;

  public constructor(bot: HeyBoxBot, single: boolean) {
    this.bot = bot;
    this.single = single;
  }

  public registerPlugin(plugin: Plugin): PluginManager {
    this.plugins.push(plugin);
    return this;
  }

  public load(plugin: Plugin): PluginManager {
    // ...
    return this;
  }

  public unload(plugin: Plugin): PluginManager {
    // ...
    return this;
  }

  public setRootDirectory(path: string): PluginManager {
    this.rootDirectory = path;
    return this;
  }

  public init(): PluginManager {
    const pluginsPath = `${this.rootDirectory}/${Constants.pluginPath}`;
    if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath);
    return this;
  }

  public getPlugins(): Plugin[] {
    return this.plugins;
  }
}

export class HeyBoxBot {
  private static instance: HeyBoxBot;
  private readonly commandManager: CustomCommandManager;
  private readonly eventManager: EventManager;
  private readonly pluginManager: PluginManager;

  private constructor(single: boolean = false) {
    this.commandManager = new CustomCommandManager();
    this.eventManager = new EventManager();
    this.pluginManager = new PluginManager(this, single);
  }

  public static getInstance(): HeyBoxBot {
    if (!HeyBoxBot.instance) HeyBoxBot.instance = new HeyBoxBot();
    return HeyBoxBot.instance;
  }

  public static loadPlugin(plugin: Plugin): HeyBoxBot {
    let bot = plugin.isSingle() ? new HeyBoxBot() : HeyBoxBot.getInstance();
    bot.pluginManager.load(plugin);
    return bot;
  }

  public async start(path: string = process.cwd()): Promise<HeyBoxBot> {
    this.pluginManager.setRootDirectory(path);
    this.pluginManager.init();
    return this;
  }

  public stop(): HeyBoxBot {
    // ...
    return this;
  }

  /**
   * 定义一个命令装饰器，用于注册自定义命令
   * @param namespace 命令的命名空间，用于区分不同的命令集
   * @param command 命令的字符串表示，包括子命令和参数
   * @returns 一个函数，该函数接受命令的执行逻辑作为参数
   *
   * 此装饰器函数的作用是解析命令字符串，并将命令的执行逻辑与命令结构关联起来
   * 它首先检查命令是否以指定的前缀开始，然后分割命令字符串为多个节点，
   * 遍历这些节点构建命令的解析树，最后将构建的根节点注册到命令管理器中
   *
   * @example
   * @ bot.command('/test command {arg0: NUMBER} run {arg1: STRING} set {arg2: BOOLEAN}')
   * function testCommand(arg0: number, arg1: string, arg2: boolean) {}
   */
  public command(namespace: string, command: string): Function {
    // 当前命令管理器实例的别名，用于内部函数中引用
    const self = this;
    return function (executor: (...args: any) => void) {
      // 确保传入的命令字符串以正确的前缀开始
      if (!command.startsWith(self.commandManager.prefix)) {
        throw new Error('Invalid command');
      }
      // 去除前缀后，分割并处理命令字符串
      const commands = command.substring(self.commandManager.prefix.length);
      const nodes = commands.split(' ');
      // 再次校验命令的有效性
      if (nodes.length <= 0) {
        throw new Error('Invalid command');
      }
      // 根节点初始化
      let root = undefined;
      // 当前节点，用于递归构建命令节点树
      let curNode;
      // 遍历所有节点，构建命令节点树
      for (const node of nodes) {
        const cmdNode = CustomCommandManager.parseNode(node);
        // 如果根节点未设置，且当前节点不是字面值节点，则抛出异常
        if (!root) {
          if (!cmdNode.isLiteral()) {
            throw new Error('Invalid command, root node can not be argument node!');
          }
          root = cmdNode;
        } else {
          // 通过then方法将当前节点链接到前一个节点，形成树状结构
          curNode!.then(cmdNode);
        }
        // 更新当前节点为下一个节点
        curNode = cmdNode;
      }
      // 将执行逻辑绑定到命令树的最深节点
      curNode!.execute(executor);
      // 将构建完成的根节点注册到命令管理器中
      self.commandManager.register(namespace, root!);
    };
  }

  /**
   * 静态方法：为命令注册一个处理函数
   *
   * 此方法使用装饰器语法糖来注册命令处理函数，简化了命令的注册过程
   * 它会返回一个函数，该函数实际上是在命令命名空间下注册特定命令的处理函数
   *
   * @param namespace 命令的命名空间，用于归类命令
   * @param command 命令的模式字符串，包括命令路径和参数模式
   * @returns 返回一个函数，该函数在调用时会注册命令处理函数
   *
   * @example
   * @ HeyBoxBot.command('/test command {arg0: NUMBER} run {arg1: STRING} set {arg2: BOOLEAN}')
   * function testCommand(arg0: number, arg1: string, arg2: boolean) {}
   */
  public static command(namespace: string, command: string): Function {
    return HeyBoxBot.getInstance().command(namespace, command);
  }
}

export const bot = HeyBoxBot.getInstance();
bot.start();
