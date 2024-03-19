import { useQuery } from '@tanstack/react-query'
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
} from '../types'

const useListMedia = () => {
  const [tempDate, setTempDate] = useState<{ start?: string; end?: string }>({
    start: undefined,
    end: undefined,
  })
  const { listMediaQueries, setListMediaQueries } = useAppStore()
  const [totalCount, setTotalCount] = useState(0)

  const getListMedia = (payload?: Partial<GetListMediaRequest>) => {
    const queries = { ...listMediaQueries, ...payload, take: 10 }
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

  const onChangeCategory = (id: string) => {
    console.log(id)
    setListMediaQueries({ categoryId: id })
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
    return setListMediaQueries({ timeRange: time })
  }

  const onChangeVideoOfMine = (payload: boolean) => {
    setListMediaQueries({ isMyFile: payload })
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
    setListMediaQueries({ keyword: text })
  }, 1000)

  useEffect(() => {
    if (tempDate.start && tempDate.end) {
      setListMediaQueries({ startDate: tempDate.start, endDate: tempDate.end })
    }
  }, [tempDate])

  return {
    timeRangeCustom: tempDate,
    getListMedia,
    totalCount,
    setTotalCount,
    onChangePagination,
    onNextPagination,
    onPrevPagination,
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

export { useCategory, useDetailMedia, useListMedia }
