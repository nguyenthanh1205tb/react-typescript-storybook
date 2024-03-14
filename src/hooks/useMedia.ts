import { useCallback, useState } from 'react';
import { request } from '../lib/request';
import { APIConfigs } from '../lib/request/core/ApiConfig';
import {
  FileType,
  GetDetailMediaResponse,
  GetListMediaRequest,
  GetListMediaResponse,
  HookState,
  OrderByType,
  OrderType,
} from '../types';
import useAppStore from '../stores/useAppStore';
import { PAGINATE_LIMIT } from '../configs';
import { useQuery } from '@tanstack/react-query';

const useListMedia = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [requestData, setRequestData] = useState<Partial<GetListMediaRequest>>({
    order: OrderType.DESC,
    page: 1,
    take: PAGINATE_LIMIT,
    orderBy: OrderByType.CREATED_AT,
    fileType: FileType.VIDEO,
  });

  const getListMedia = (payload?: Partial<GetListMediaRequest>) => {
    const queries = { ...requestData, ...payload };
    return useQuery<GetListMediaResponse>({
      queryKey: ['getListMedia', requestData],
      queryFn: () =>
        request<GetListMediaResponse>(APIConfigs(), {
          url: '/media/files',
          method: 'GET',
          query: queries,
        }),
    });
  };

  const onChangePagination = (page: number) =>
    setRequestData((prev) => ({
      ...prev,
      page,
    }));

  const onNextPagination = () => {
    if ((requestData.page ?? 1) >= Math.ceil(totalCount / PAGINATE_LIMIT))
      return;
    setRequestData((prev) => ({
      ...prev,
      page: (prev.page ?? 1) + 1,
    }));
  };

  const onPrevPagination = () => {
    if ((requestData.page ?? 1) <= 1) return;
    console.log((requestData.page ?? 1) - 1);
    setRequestData((prev) => ({
      ...prev,
      page: (prev.page ?? 1) - 1,
    }));
  };

  // const getListMediaByImage = () => {
  //   setRequestData((prev) => ({...prev, }));
  // };

  return {
    getListMedia,
    totalCount,
    requestData,
    setTotalCount,
    onChangePagination,
    onNextPagination,
    onPrevPagination,
  };
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
