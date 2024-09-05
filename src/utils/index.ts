import { Constants } from '../constants/constants';
import axios, { AxiosResponse } from 'axios';
import { ChannelImSendReq, Response } from '../type/define';

export function getHeaders(token: string | undefined = undefined) {
  return {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Content-Type': 'application/json;charset=UTF-8',
    'token': token
  };
}

export function sendMessage(token: string, payload: ChannelImSendReq) {
  const url = `${Constants.HTTP_HOST}${Constants.SEND_MSG_URL}${Constants.COMMON_PARAMS}`;

  axios
    .post(url, payload, {
      headers: getHeaders(token)
    })
    .then((response: AxiosResponse<Response>) => {
      console.log(response.data);
    });
}
