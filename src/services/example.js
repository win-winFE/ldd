import {GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH} from '../utils/request'; // eslint-disable-line

/**
 * 示例：ajax获取后端数据
 * */
export function getBanners(body) {
  return GET('/getBanners', body);
}
