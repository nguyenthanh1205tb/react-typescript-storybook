import { useCallback, useState } from 'react';
import { request } from '../lib/request';
import { APIConfigs } from '../lib/request/core/ApiConfig';
import {
  GetDetailMediaResponse,
  GetListCategoriesResponse,
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
  const { listMediaQueries, setListMediaQueries } = useAppStore();
  const [totalCount, setTotalCount] = useState(0);

  const getListMedia = (payload?: Partial<GetListMediaRequest>) => {
    const queries = { ...listMediaQueries, ...payload };
    return useQuery<GetListMediaResponse>({
      queryKey: ['getListMedia', queries],
      queryFn: () =>
        request<GetListMediaResponse>(APIConfigs(), {
          url: '/media/files',
          method: 'GET',
          query: queries,
        }),
    });
  };

  const onChangePagination = (page: number) => setListMediaQueries({ page });

  const onNextPagination = useCallback(() => {
    if ((listMediaQueries.page ?? 1) >= Math.ceil(totalCount / PAGINATE_LIMIT))
      return;
    setListMediaQueries({ page: (listMediaQueries.page ?? 1) + 1 });
  }, [totalCount, listMediaQueries]);

  const onPrevPagination = useCallback(() => {
    if ((listMediaQueries.page ?? 1) <= 1) return;
    setListMediaQueries({ page: (listMediaQueries.page ?? 1) - 1 });
  }, [listMediaQueries]);

  const onChangeOrder = (payload: string[]) => {
    const orderBy = payload[0] as OrderByType;
    const orderType = payload[1] as OrderType;
    setListMediaQueries({ orderBy, order: orderType });
  };

  const onChangeCategory = (payload: string) => {
    setListMediaQueries({ categoryId: payload });
  };

  return {
    getListMedia,
    totalCount,
    setTotalCount,
    onChangePagination,
    onNextPagination,
    onPrevPagination,
    onChangeOrder,
    onChangeCategory,
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

const useCategory = () => {
  const getListCategories = () => {
    return useQuery<GetListCategoriesResponse>({
      queryKey: ['getListCategories'],
      queryFn: () =>
        request<GetListCategoriesResponse>(APIConfigs(), {
          method: 'GET',
          url: '/media/category',
        }),
    });
  };

  return { getListCategories };
};

export { useListMedia, useDetailMedia, useCategory };
