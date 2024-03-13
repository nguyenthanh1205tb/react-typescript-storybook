import { MEDIA_BASE_ENDPOINT } from '@/src/configs';
import { AvatarThumb } from '@/src/types';
import _isEmpty from 'lodash/isEmpty';

export const getMediaUrl = (path: string | undefined | null) => {
  // const s3Endpoint = getThemeConfig('s3Endpoint');
  const s3Endpoint = 'https://s3.hn-1.cloud.cmctelecom.vn/plc-storage';
  if (s3Endpoint) {
    return `${s3Endpoint}/${path}`;
  }
  return MEDIA_BASE_ENDPOINT + '/' + path;
};

export const avatarUrl = (d?: AvatarThumb) => {
  if (!d || _isEmpty(d)) return '';
  if (d.url_list.length && d.url_list[0] !== '') return d.url_list[0];
  return d.uri;
};
