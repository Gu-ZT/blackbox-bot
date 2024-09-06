// noinspection JSUnusedGlobalSymbols

import { Constants } from '../constants/constants';
import axios from 'axios';
import { TextMessage } from '../type/define';

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

export function sendMessage(token: string, payload: TextMessage) {
  const url = `${Constants.HTTP_HOST}${Constants.SEND_MSG_URL}${Constants.COMMON_PARAMS}`;
  axios
    .post(url, payload, {
      headers: getHeaders(token)
    })
    .then();
}

export function hashDJB2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // 确保结果为非负整数
}

export class SeededRandom {
  seed: number;
  m: number;
  a: number;
  c: number;
  state: number;

  constructor(seed: number) {
    this.seed = seed;
    this.m = 0x80000000; // 2^31
    this.a = 1103515245;
    this.c = 12345;
    this.state = ((seed % this.m) + this.m) % this.m;
  }

  next() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / this.m;
  }

  nextInt(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
