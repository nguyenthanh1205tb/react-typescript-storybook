/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query'
import _debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'
import { PAGINATE_LIMIT } from '../configs'
import { request } from '../lib/request'
import { APIConfigs } from '../lib/request/core/ApiConfig'
import useAppStore from '../stores/useAppStore'
import {
  GetDetailMediaResponse,
  GetListCategoriesResponse,
  GetListMediaRequest,
  GetListMediaResponse,
  GetListMediaTimeRange,
  HookState,
  OrderByType,
  OrderType,
  TrimVideoRequest,
  TrimVideoResponse,
} from '../types'

const useListMedia = () => {
  const [tempDate, setTempDate] = useState<{ start?: string; end?: string }>({
    start: undefined,
    end: undefined,
  })
  const { listMediaQueries, setListMediaQueries } = useAppStore()
  const [totalCount, setTotalCount] = useState(0)

  const getListMedia = (payload?: Partial<GetListMediaRequest>) => {
    const queries = { ...listMediaQueries, ...payload }
    return useQuery<GetListMediaResponse>({
      queryKey: ['getListMedia', queries],
      queryFn: () =>
        request<GetListMediaResponse>(APIConfigs(), {
          url: '/media/files',
          method: 'GET',
          query: queries,
        }),
    })
  }

  const onChangePagination = (page: number) => setListMediaQueries({ page })

  const onNextPagination = useCallback(() => {
    if ((listMediaQueries.page ?? 1) >= Math.ceil(totalCount / PAGINATE_LIMIT)) return
    setListMediaQueries({ page: (listMediaQueries.page ?? 1) + 1 })
  }, [totalCount, listMediaQueries])

  const onPrevPagination = useCallback(() => {
    if ((listMediaQueries.page ?? 1) <= 1) return
    setListMediaQueries({ page: (listMediaQueries.page ?? 1) - 1 })
  }, [listMediaQueries])

  const onChangeOrder = (payload: string[]) => {
    const orderBy = payload[0] as OrderByType
    const orderType = payload[1] as OrderType
    setListMediaQueries({ orderBy, order: orderType })
  }

  const onChangeTag = (e: any) => {
    setListMediaQueries({ tag: e.target.value, page: 1 })
  }

  const onChangeCategory = (id: string) => {
    setListMediaQueries({ categoryId: id, page: 1 })
  }

  const onChangeTimeRange = (time: GetListMediaTimeRange) => {
    if (time !== GetListMediaTimeRange.custom) {
      setTempDate({})
      return setListMediaQueries({
        timeRange: time,
        startDate: undefined,
        endDate: undefined,
      })
    }
    return setListMediaQueries({ timeRange: time, page: 1 })
  }

  const onChangeVideoOfMine = (payload: boolean) => {
    setListMediaQueries({ isMyFile: payload, page: 1 })
  }

  const onChangeTimeRangeCustom = (t: 'start' | 'end', date?: Date) => {
    if (!date) return
    switch (t) {
      case 'start':
        return setTempDate(prev => ({ ...prev, start: date.toISOString() }))
      case 'end':
        return setTempDate(prev => ({ ...prev, end: date.toISOString() }))
    }
  }

  const onSearchByText = _debounce((text: string) => {
    setListMediaQueries({ keyword: text, page: 1 })
  }, 1000)

  useEffect(() => {
    if (tempDate.start && tempDate.end) {
      setListMediaQueries({ startDate: tempDate.start, endDate: tempDate.end, page: 1 })
    }
  }, [tempDate])

  return {
    timeRangeCustom: tempDate,
    totalCount,
    getListMedia,
    setTotalCount,
    onChangePagination,
    onNextPagination,
    onPrevPagination,
    onChangeTag,
    onChangeOrder,
    onChangeCategory,
    onChangeTimeRange,
    onChangeVideoOfMine,
    onChangeTimeRangeCustom,
    onSearchByText,
  }
}

const useDetailMedia = () => {
  const { setMediaSelectedData } = useAppStore()
  const [state, setState] = useState<HookState<GetDetailMediaResponse>>({
    loading: false,
    data: null,
    err: null,
  })
  const getDetailMedia = async (mediaId: string) => {
    setState({ data: null, err: null, loading: true })
    try {
      const result = await request<GetDetailMediaResponse>(APIConfigs(), {
        url: '/media/{id}',
        method: 'GET',
        path: {
          id: mediaId,
        },
      })
      setMediaSelectedData(result)
      setState({ loading: false, data: result, err: null })
    } catch {
      setState({
        loading: false,
        data: null,
        err: new Error('Can not get detail media [/media/{id}]'),
      })
    }
  }

  return { response: state, getDetailMedia }
}

const useCategory = () => {
  const getListCategories = () => {
    return useQuery<GetListCategoriesResponse>({
      queryKey: ['getListCategories'],
      queryFn: () =>
        request<GetListCategoriesResponse>(APIConfigs(), {
          method: 'GET',
          url: '/media/category',
        }),
    })
  }

  return { getListCategories }
}

const useTrimVideo = () => {
  const trimVideo = (id?: string) => {
    return useMutation({
      mutationFn: (payload: TrimVideoRequest) =>
        request<TrimVideoResponse>(APIConfigs(), {
          method: 'POST',
          url: '/media/trim/{id}',
          path: {
            id,
          },
          body: payload,
        }),
    })
  }

  return { trimVideo }
}

export { useCategory, useDetailMedia, useListMedia, useTrimVideo }
