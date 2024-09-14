import { hashDJB2, SeededRandom } from './utils';
import { CommandSource } from './command';
import { HeyBoxBot } from './';
import dayjs from 'dayjs';

const bot: HeyBoxBot = new HeyBoxBot({
  token: 'your token',
  logLevel: 'info'
});

new (class MyBot {
  @bot.command('/calc {arg0: NUMBER} {arg1: +|-|*|/|^} {arg2: NUMBER}')
  public calc(source: CommandSource, arg0: number, arg1: '+' | '-' | '*' | '/' | '^', arg2: number): boolean {
    let calc: (a: number, b: number) => number;
    switch (arg1) {
      case '-':
        calc = (a, b) => a - b;
        break;
      case '*':
        calc = (a, b) => a * b;
        break;
      case '/':
        calc = (a, b) => a / b;
        break;
      case '^':
        calc = (a, b) => Math.pow(a, b);
        break;
      default:
        calc = (a, b) => a + b;
        break;
    }
    source.success(`${arg0} ${arg1} ${arg2} = ${calc(arg0, arg2)}`);
    return true;
  }

  @bot.command('/roll {arg0: NUMBER}')
  public roll(source: CommandSource, arg0: number): boolean {
    source.success(`${arg0}点骰子: ${Math.floor(Math.random() * arg0) + 1}`);
    return true;
  }

  @bot.command('/jrrp')
  public test(source: CommandSource): boolean {
    source.success(
      `您今日的人品值为：${new SeededRandom(hashDJB2(dayjs().format('YYYY-MM-DD') + source.getName())).nextInt(0, 100)}`
    );
    return true;
  }
})();

bot.start().then();
