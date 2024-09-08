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

  public parse(value: string): T | undefined {
    return undefined;
  }

  public static parseArgument(argument: string): HeyBoxCommandArgument<any> {
    if (argument.startsWith('{') && argument.endsWith('}')) {
      const nodes: string[] = argument.substring(1, argument.length - 1).split(':');
      let name = nodes[0];
      const type = nodes[1];
      let required = false;
      if (name.endsWith('?')) {
        name = name.slice(0, -1);
        required = true;
      }
      switch (type) {
        case 'STRING':
          return new HeyBoxCommandStingArgument(name, name, required);
        case 'NUMBER':
          return new HeyBoxCommandNumberArgument(name, name, required);
        case 'BOOLEAN':
          return new HeyBoxCommandBooleanArgument(name, name, required);
        case 'USER':
          return new HeyBoxCommandUserArgument(name, name, required);
        default: {
          if (type.includes('|')) {
            const options = nodes[1].split('|');
            return new HeyBoxCommandOptionArgument(name, name, required, options);
          }
        }
      }
    }
    throw new Error('Not implemented');
  }
}

class HeyBoxCommandOptionArgument<T extends string> extends HeyBoxCommandArgument<T> {
  private readonly options: T[];

  public constructor(name: string, description: string, required: boolean, options: T[]) {
    super(name, 3, description, required);
    this.options = options;
  }

  public override parse(value: string): T | undefined {
    let t: T | undefined = undefined;
    for (const option of this.options) {
      if (option === value) {
        t = option;
      }
    }
    return t;
  }
}

class HeyBoxCommandStingArgument extends HeyBoxCommandArgument<string> {
  public constructor(name: string, description: string, required: boolean) {
    super(name, 9, description, required);
  }

  public override parse(value: string): string | undefined {
    return value;
  }
}

class HeyBoxCommandNumberArgument extends HeyBoxCommandArgument<number> {
  public constructor(name: string, description: string, required: boolean) {
    super(name, 4, description, required);
  }

  public override parse(value: string): number | undefined {
    return Number.parseInt(value);
  }
}

class HeyBoxCommandBooleanArgument extends HeyBoxCommandArgument<boolean> {
  public constructor(name: string, description: string, required: boolean) {
    super(name, 5, description, required);
  }

  public override parse(value: string): boolean | undefined {
    if (value === 'True') {
      return true;
    } else if (value === 'False') {
      return false;
    }
    return undefined;
  }
}

class HeyBoxCommandUserArgument extends HeyBoxCommandArgument<null> {
  public constructor(name: string, description: string, required: boolean) {
    super(name, 6, description, required);
  }

  public override parse(value: string): null | undefined {
    return undefined;
  }
}

class HeyBoxCommand {
  public readonly name;
  public readonly description: string;
  public readonly permission?: string;
  public readonly arguments: HeyBoxCommandArgument<any>[] = [];
  public readonly executor: (...args: any) => boolean;

  public constructor(name: string, description: string, executor: (...args: any) => boolean, permission?: string) {
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

  public parse(command: string, permission: string | undefined = undefined) {
    if (!command.startsWith('/')) throw new Error('Invalid command');
    const register = this.register;
    return function (executor: (...args: any) => boolean) {
      const commands = command.split(/(?<!:)\s/);
      commands[0] = commands[0].slice(1);
      const heyBoxCommand = new HeyBoxCommand(commands[0], commands[0], executor, permission);
      for (let i = 1; i < commands.length; i++) {
        heyBoxCommand.arguments.push(HeyBoxCommandArgument.parseArgument(commands[i]));
      }
      register(heyBoxCommand);
    };
  }
}
