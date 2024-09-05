import { Constants } from '../constants/constants';

export interface BotConfig {
  token?: string;
}

export class BotConfig {
  token?: string = undefined;
  wss: string = `${Constants.WSS_URL}${Constants.COMMON_PARAMS}${Constants.TOKEN_PARAMS}`;
}
