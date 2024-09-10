// noinspection JSUnusedGlobalSymbols

export declare type UserBaseInfo = {
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
};

export declare type UserInfo = {
  user_base_info: UserBaseInfo;
};

export declare type ChannelBaseInfo = {
  channel_id: string;
  channel_name: string;
  channel_type: number;
};

export declare type RoomBaseInfo = {
  room_avatar: string;
  room_id: string;
  room_name: string;
};
export declare type CommandOption = {
  name: string;
  type: number;
  value: string;
};
export declare type CommandInfo = {
  id: string;
  name: string;
  options: CommandOption[];
  type: number;
};

export declare type ResponseResult = {
  chatmobile_ack_id: string;
  heychat_ack_id: string;
};

export declare type Response = {
  msg: string;
  result: ResponseResult;
  status: string;
};

export declare type AvatarDecoration = {
  src_type: string;
  src_url: string;
};

export declare type TextMessage = {
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
};

export declare type WebSocketMessageData = {
  msg_id: string;
  send_time: number;
};

export declare type UserImMessage = WebSocketMessageData & {
  room_id: string;
  room_nickname: string;
  channel_id: string;
  channel_name: string;
  channel_type: number;
  msg: string;
  user_info: UserInfo;
};

export declare type CommandMessage = WebSocketMessageData & {
  bot_id: number;
  channel_base_info: ChannelBaseInfo;
  command_info: CommandInfo;
  room_base_info: RoomBaseInfo;
  sender_info: UserBaseInfo;
};

export declare type WebSocketMessage = {
  sequence: number;
  type: string;
  notify_type: string;
  data: WebSocketMessageData;
  timestamp: number;
};

export declare type WebSocketUserImMessage = WebSocketMessage & {
  data: UserImMessage;
};

export declare type WebSocketCommandMessage = WebSocketMessage & {
  data: CommandMessage;
};
