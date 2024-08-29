import { CommandManager } from 'gugle-command';
import { EventManager } from 'gugle-event';

class BlackBoxBot {
  private readonly commandManager: CommandManager;
  private readonly eventManager: EventManager;

  public constructor() {
    this.commandManager = new CommandManager();
    this.eventManager = new EventManager();
  }

  public async start(): Promise<void> {
    // ...
  }

  public stop(): void {
    // ...
  }
}
