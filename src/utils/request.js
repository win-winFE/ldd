// ajax请求封装，
import fetch from 'dva/fetch';
import {LoadingInAjax} from '../components/index';
import {alert} from './utils';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * 假设数据返回格式{ code, succ, errMsg, data }
 * succ判断成功失败，errMsg为错误信息，
 * code控制一些特殊状态，如：登录过期，需要重返登录页，
 * */
function checkResult(res) {
  const {success, message} = res;
  if (success) {
    // return Object.keys(other).length ? {message, ...other} : message;
    return message;
  }
  alert(message);
  throw new Error(message);
}

function parseParams(obj) {
  if (!obj) return '';
  if (typeof obj !== 'object') return obj;

  let resArr = [];
  Object.keys(obj).forEach(value => {
    let str = value + '=' + encodeURIComponent(obj[value]);
    resArr.push(str);
  });
  return resArr.join('&');
}


let requestCount = 0;
let timeoutForLoadingToShow;

function requestStart() {
  requestCount++;
  clearTimeout(timeoutForLoadingToShow);
  timeoutForLoadingToShow = setTimeout(_ => {
    LoadingInAjax.show();
  }, 50);
}


function requestEnd() {
  requestCount--;
  // console.log('requestCount = ' + requestCount);
  if (requestCount < 1) {
    clearTimeout(timeoutForLoadingToShow);
    LoadingInAjax.hide();
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // 设置默认选项
  let defaultOpt = {
    method: 'GET',
    credentials: 'include', // same-origin（同源）， include（跨源）， omit（不包含cookie）
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  };

  let newOpt = {...defaultOpt, ...options};

  const {body, method} = newOpt;

  // 去除多余属性
  if (typeof body === 'object') {
    Object.keys(body).forEach(key => {
      if (!body[key] && body[key] !== 0) {
        delete body[key];
      }
    });
  }


  // GET 与 HEAD 方法不允许body，否则报错
  if (method === 'GET' || method === 'HEAD') {

    if (url.indexOf('?') === -1) {
      url += '?' + parseParams(body);
    } else {
      url += '&' + parseParams(body);
    }


    delete newOpt.body;
  } else {
    newOpt.body = JSON.stringify(body);
  }


  requestStart();
  return fetch('/api' + url, newOpt)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResult)
    .then(res => {
      requestEnd();
      return res;
    }, e => {
      requestEnd();
      throw e;
    });
}

/**
 * 以get方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function GET(url, body = {}) {
  const method = 'GET';
  return request(url, {method, body});
}

/**
 * 以POST方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function POST(url, body = {}) {
  const method = 'POST';
  return request(url, {method, body});
}

/**
 * 以DELETE方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function DELETE(url, body = {}) {
  const method = 'DELETE';
  return request(url, {method, body});
}

/**
 * 以PUT方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function PUT(url, body = {}) {
  const method = 'PUT';
  return request(url, {method, body});
}

/**
 * 以OPTIONS方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function OPTIONS(url, body = {}) {
  const method = 'OPTIONS';
  return request(url, {method, body});
}

/**
 * 以PATCH方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function PATCH(url, body = {}) {
  const method = 'PATCH';
  return request(url, {method, body});
}

/**
 * 以HEAD方式请求
 * @param {string} url 请求的地址，如：/banner/{id}
 * @param {object} body  请求的参数，如：{id:123}
 * */
function HEAD(url, body = {}) {
  const method = 'HEAD';
  return request(url, {method, body});
}

export {GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH};
