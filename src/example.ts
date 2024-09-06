import { HeyBoxBot } from './index';
import { CommandSource } from 'gugle-command';
import { hashDJB2, SeededRandom } from './utils';
import dayjs from 'dayjs';

const bot: HeyBoxBot = new HeyBoxBot({
  token: '',
  logLevel: 'info'
});

class MyBot {
  @bot.command('jrrp', '/jrrp')
  public test(source: CommandSource) {
    source.success(
      `您今日的人品值为：${new SeededRandom(hashDJB2(dayjs().format('YYYY-MM-DD') + source.getName())).nextInt(0, 100)}`
    );
  }
}

const myBot: MyBot = new MyBot();

bot.start();
