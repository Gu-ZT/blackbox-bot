import { Arguments, CommandManager, CommandNode } from 'gugle-command';

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
