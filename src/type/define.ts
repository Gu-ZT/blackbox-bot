// noinspection JSUnusedGlobalSymbols

export interface ResponseResult {
  chatmobile_ack_id: string;
  heychat_ack_id: string;
}

export interface Response {
  msg: string;
  result: ResponseResult;
  status: string;
}

export interface CommandInfo {
  name: string;
  type: number;
  options: Options[];
}

export interface Options {
  value: string;
  name: string;
  choices: Options[];
  type: number;
}

export interface RoomBaseInfo {
  room_avatar: string;
  room_id: string;
  room_name: string;
}

export interface AvatarDecoration {
  src_type: string;
  src_url: string;
}

export interface SenderInfo {
  avatar: string;
  avatar_decoration: AvatarDecoration;
  bot: boolean;
  level: number;
  medals: any;
  nickname: string;
  roles: string[];
  room_nickname: string;
  tag: any;
  user_id: number;
}

export interface ChannelBaseInfo {
  channel_id: string;
  channel_name: string;
  channel_type: number;
}

export interface UseCommandData {
  bot_id: number;
  channel_base_info: ChannelBaseInfo;
  command_info: CommandInfo;
  msg_id: string;
  room_base_info: RoomBaseInfo;
  send_time: number;
  sender_info: SenderInfo;
}

export interface ChannelImSendReq {
  msg: string;
  msg_type: number;
  heychat_ack_id: string;
  reply_id: string;
  room_id: string;
  addition: string;
  at_user_id: string;
  at_role_id: string;
  mention_channel_id: string;
  channel_id: string;
  channel_type: number;
}
