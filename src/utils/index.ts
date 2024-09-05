import { Index } from '../constants';
import axios, { AxiosResponse } from 'axios';
import { ChannelImSendReq, Response } from '../type/define';

function get_headers(token: string | undefined = undefined) {
  return {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Content-Type': 'application/json;charset=UTF-8',
    'token': token
  };
}

function sendMessage(token: string, payload: ChannelImSendReq) {
  const url = `${Index.HTTP_HOST}${Index.SEND_MSG_URL}${Index.COMMON_PARAMS}`;

  axios
    .post(url, payload, {
      headers: get_headers(token)
    })
    .then((response: AxiosResponse<Response>) => {
      console.log(response.data);
    });
}
