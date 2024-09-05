import { CommandManager, CommandSource } from 'gugle-command';
import { EventManager, Cancelable } from 'gugle-event';
import { RawData, WebSocket } from 'ws';
import * as process from 'node:process';
import { BotConfig } from './config';
import { Constants } from './constants/constants';
import { CustomCommandManager } from './command';

export class HeyBoxBot {
  private readonly config: BotConfig;
  private readonly commandManager: CustomCommandManager;
  private readonly eventManager: EventManager;
  private readonly ws: WebSocket;
  private wsOpened: boolean = false;

  public constructor(config: BotConfig = {} as BotConfig) {
    this.config = config;
    this.commandManager = new CustomCommandManager();
    this.eventManager = new EventManager();
    this.ws = new WebSocket(
      `${Constants.WSS_URL}${Constants.COMMON_PARAMS}${Constants.TOKEN_PARAMS}${this.config.token}`
    );
    this.ws.on('open', () => {
      this.wsOpened = true;
      const ping = () => {
        this.ws.send('PING');
        setTimeout(ping, 30000);
      };
      ping();
    });
  }

  public static create(config: BotConfig = new BotConfig()): HeyBoxBot {
    return new HeyBoxBot(config);
  }

  public async start(path: string = process.cwd()): Promise<HeyBoxBot> {
    await this.post('before-start', this, path).then(args => {
      path = args[1];
    });
    this.ws.on('message', event => {
      this.post('websocket-message', this, event);
    });
    await this.post('after-start', this);
    return this;
  }

  public stop(): HeyBoxBot {
    // ...
    this.post('after-stop', this).then();
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
   * @ bot.command('test', '/test command {arg0: NUMBER} run {arg1: STRING} set {arg2: BOOLEAN}')
   * function testCommand(source:CommandSource, arg0: number, arg1: string, arg2: boolean) {}
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
   * 发布一个事件，触发该事件的所有监听器
   * @param event {string} 事件名称
   * @param args {...args: any} 传递给事件回调的参数
   * @returns {any[]} 事件回调的返回值（如果有）
   */
  public async post(event: string, ...args: any): Promise<any[]> {
    return await this.eventManager.post(event, ...args);
  }

  /**
   * 订阅一个事件，返回一个函数，该函数用于添加事件回调
   * @param event {string} 事件名称
   * @param namespace {string} 命名空间，用于组织事件监听器
   * @param priority {number} 优先级，决定事件回调的执行顺序
   * @param cancelable {boolean} 是否可取消，决定是否可以取消事件，为 true 时，处理器第一个参数会传入 {@link Cancelable}
   * @returns {(callback: (...args: any) => void) => void} 一个函数，接受事件回调并注册该回调到指定事件
   */
  public subscribe(
    event: string,
    namespace: string = 'gugle-event',
    priority: number = 100,
    cancelable: boolean = false
  ): (callback: (...args: any) => void) => void {
    return this.eventManager.subscribe(event, namespace, priority, cancelable);
  }
}
