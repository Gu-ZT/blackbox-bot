import { createLogger, Logger, transports, format } from 'winston';
import dayjs from 'dayjs';

export class LoggerFactory {
  public static createLogger(
    name: string | undefined = undefined,
    path: string = process.cwd(),
    logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info'
  ): Logger {
    return createLogger({
      level: logLevel,
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(
              info =>
                `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]${name ? `[${name}]` : ''}[${info.level}] ${info.message}`
            )
          )
        }),
        new transports.File({
          filename: `${path}/latest.log`,
          format: format.printf(
            info =>
              `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]${name ? `[${name}]` : ''}[${info.level}] ${info.message}`
          )
        })
      ]
    });
  }
}
