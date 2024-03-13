import { useState } from 'react';
import { request } from '../lib/request';
import { APIConfigs } from '../lib/request/core/ApiConfig';
import {
  GetDetailMediaResponse,
  GetListMediaRequest,
  GetListMediaResponse,
  HookState,
  OrderByType,
  OrderType,
} from '../types';
import { getOrganizationId } from '../lib/utils/auth';
import useAppStore from '../stores/useAppStore';

const useListMedia = () => {
  const [state, setState] = useState<HookState<GetListMediaResponse>>({
    loading: false,
    data: null,
    err: null,
  });
  const getListMedia = async (payload: Partial<GetListMediaRequest>) => {
    setState({ data: null, err: null, loading: true });
    const queries: Partial<GetListMediaRequest> = {
      order: OrderType.DESC,
      page: 1,
      take: 20,
      orderBy: OrderByType.CREATED_AT,
      ...payload,
    };
    try {
      const result = await request<GetListMediaResponse>(APIConfigs(), {
        url: '/media/files',
        method: 'GET',
        query: queries,
      });
      setState({ loading: false, data: result, err: null });
    } catch {
      setState({
        loading: false,
        data: null,
        err: new Error('Can not get list media [/media/files]'),
      });
    }
  };

  return { response: state, getListMedia };
};

const useDetailMedia = () => {
  const { setMediaSelectedData } = useAppStore();
  const [state, setState] = useState<HookState<GetDetailMediaResponse>>({
    loading: false,
    data: null,
    err: null,
  });
  const getDetailMedia = async (mediaId: string) => {
    setState({ data: null, err: null, loading: true });
    try {
      const result = await request<GetDetailMediaResponse>(APIConfigs(), {
        url: '/media/{id}',
        method: 'GET',
        path: {
          id: mediaId,
        },
      });
      setMediaSelectedData(result);
      setState({ loading: false, data: result, err: null });
    } catch {
      setState({
        loading: false,
        data: null,
        err: new Error('Can not get detail media [/media/{id}]'),
      });
    }
  };

  return { response: state, getDetailMedia };
};

export { useListMedia, useDetailMedia };
