import { Arguments, CommandManager, CommandNode } from 'gugle-command';
import { Logger } from 'winston';

export class CustomCommandManager extends CommandManager {
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

class HeyBoxCommandArgument<T> {
  public readonly name: string;
  public readonly type: number;
  public readonly description: string;
  public readonly required: boolean;

  public constructor(name: string, type: number, description: string, required: boolean) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.required = required;
  }

  public parse(value: any): T | undefined {
    return undefined;
  }
}

class HeyBoxCommandStingArgument extends HeyBoxCommandArgument<string> {
  public constructor(name: string, description: string, required: boolean) {
    super(name, 3, description, required);
  }
}

class HeyBoxCommand {
  public readonly name;
  public readonly description: string;
  public readonly permission: string;
  public readonly arguments: HeyBoxCommandArgument<any>[] = [];
  public readonly executor: (...args: any) => boolean;

  public constructor(name: string, description: string, permission: string, executor: (...args: any) => boolean) {
    this.name = name;
    this.description = description;
    this.permission = permission;
    this.executor = executor;
  }
}

export class HeyBoxCommandManager {
  public readonly commands: Map<string, HeyBoxCommand> = new Map();
  public readonly logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public register(command: HeyBoxCommand): void {
    if (this.commands.has(command.name)) {
      this.logger.error(`Command ${command.name} is already registered!`);
      return;
    }
    this.commands.set(command.name, command);
  }

  public execute(command: any): void {}

  public parse(command: string) {
    return function (executor: (...args: any) => boolean) {};
  }
}
