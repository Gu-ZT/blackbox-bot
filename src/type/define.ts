// noinspection JSUnusedGlobalSymbols

export interface WebSocketMessage {
  sequence: number;
  type: string;
  notify_type: string;
  data: any;
  timestamp: number;
}

export interface UserBaseInfo {
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

export interface UserInfo {
  user_base_info: UserBaseInfo;
}

export interface UserImMessage {
  room_id: string;
  room_nickname: string;
  channel_id: string;
  channel_name: string;
  channel_type: number;
  send_time: number;
  msg: string;
  msg_id: string;
  user_info: UserInfo;
}

export interface WebSocketUserImMessage extends WebSocketMessage {
  data: UserImMessage;
}

export interface ResponseResult {
  chatmobile_ack_id: string;
  heychat_ack_id: string;
}

export interface Response {
  msg: string;
  result: ResponseResult;
  status: string;
}

export interface AvatarDecoration {
  src_type: string;
  src_url: string;
}

export interface TextMessage {
  msg: string;
  msg_type: 10;
  heychat_ack_id: '0';
  reply_id: string;
  room_id: string;
  addition: '{"img_files_info":[]}';
  at_user_id: string;
  at_role_id: string;
  mention_channel_id: string;
  channel_id: string;
  channel_type: number;
}
