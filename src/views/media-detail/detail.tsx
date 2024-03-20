/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultiSelectChild } from '@/src/components/common/dropdown/dropdown-with-child'
import Image from '@/src/components/common/image'
import { MultiSelectField } from '@/src/components/common/multi-select/muti-select-field'
import VideoPlayer from '@/src/components/common/video-player'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Textarea } from '@/src/components/ui/textarea'
import { useToast } from '@/src/components/ui/use-toast'
import { UPLOAD_ENDPOINT } from '@/src/configs'
import Each from '@/src/hooks/each'
import If from '@/src/hooks/if'
import { request } from '@/src/lib/request'
import { APIConfigs } from '@/src/lib/request/core/ApiConfig'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import cn from 'classnames'
import {
  CalendarFold,
  CircleFadingPlus,
  Code,
  Download,
  Frame,
  Images,
  Loader,
  MoreVertical,
  NotebookText,
  Ruler,
  Scissors,
  X,
} from 'lucide-react'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useCategory, useDetailMedia } from '../../hooks/useMedia'
import { formatBytes } from '../../lib/utils/media'
import useAppStore from '../../stores/useAppStore'
import { Category, ComboboxOption, MediaCodec, MediaEntity, MediaPackageType, MediaPacks, Video } from '../../types'
import ListThumb from './list-thumb'

interface Props {
  type: MediaPackageType
  onExportData?: (data: MediaEntity[]) => void
}

export const videoUrl = (d?: Video) => {
  if (!d) return
  const defaultUri = d?.uri
  const hls = d.play_url.hls
  if (!hls || !hls.length) return defaultUri
  const item = hls.find(val => val.codec === MediaCodec.H264 && val.pack === MediaPacks.HLS)
  if (!item) return defaultUri
  return item.uri
}

export const getUrlThumb = (url: string) => {
  const parts = url.split('/')
  const desiredPath = parts.slice(-4).join('/')
  return desiredPath
}

const Detail = ({ type, onExportData }: Props) => {
  const [showModal, setShowModal] = React.useState(false)
  const [avatarSelected, setAvatarSelected] = React.useState<string>('')
  const { mediaSelectedID, mediaSelectedData, setMediaSelectedData } = useAppStore()
  const { response, getDetailMedia } = useDetailMedia()
  const { getListCategories } = useCategory()
  const { data: categoriesData } = getListCategories()
  const { toast } = useToast()

  const extractCategories = (list: Category[]): Array<ComboboxOption> => {
    const result = list.map(item => {
      return {
        label: item.name,
        value: item.id,
        children: item.children ? extractCategories(item.children) : null,
      }
    })

    return result
  }

  const onUploadThumb = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('mf-token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setAvatarSelected(data.url)
      })
  }

  const categoriesFiltered = useMemo(() => {
    if (!categoriesData) return []
    return extractCategories(categoriesData.data ?? [])
  }, [categoriesData])

  // 1. Define your form.
  const form = useForm()

  const mediaAccords = [
    {
      headerName: 'Chi tiết',
    },
    {
      headerName: 'Lịch sử',
      hide: true,
    },
    {
      headerName: 'Sử dụng',
      hide: true,
    },
    {
      headerName: 'Liên quan',
      hide: true,
    },
    {
      headerName: 'Thông tin quảng cáo',
      hide: true,
    },
  ]

  const haveMediaSelectedID = useMemo(() => mediaSelectedID !== null && mediaSelectedID !== '', [mediaSelectedID])

  useEffect(() => {
    if (mediaSelectedID) {
      getDetailMedia(mediaSelectedID)
    }
  }, [mediaSelectedID])

  const queryClient = useQueryClient()

  const { mutateAsync: onSubmitMedia } = useMutation({
    mutationFn: (values: any) =>
      request<any>(APIConfigs(), {
        url: `/media/${mediaSelectedID}`,
        method: 'PUT',
        body: values,
      }),
    onSuccess: () => {
      toast({
        description: 'Cập nhật thành công',
      })
      queryClient.invalidateQueries({
        queryKey: ['getListMedia'],
      })
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: any) {
    onSubmitMedia(values)
  }

  const onSubmitThumb = useCallback(() => {
    if (avatarSelected) {
      onSubmitMedia({ avatar: getUrlThumb(avatarSelected) }).then(() => {
        setAvatarSelected('')
      })
    } else {
      toast({
        description: 'Chưa chọn ảnh',
      })
    }
  }, [avatarSelected])

  useEffect(() => {
    if (mediaSelectedData?.data) {
      form.reset({
        name: mediaSelectedData.data.name,
        description: mediaSelectedData.data.description,
        categoryIds: mediaSelectedData.data.categories?.map(item => item.id) ?? [],
        tags: mediaSelectedData.data.tags || [],
      })
    }
  }, [response.data?.data])

  return (
    <div
      className={cn(
        'tw-bg-slate-800 tw-text-white tw-relative tw-h-full tw-w-full tw-flex-none tw-transition-all tw-max-h-[658px]',
        {
          'tw-max-w-[450px]': haveMediaSelectedID,
          'tw-max-w-0': !haveMediaSelectedID,
        },
      )}>
      <div
        className={cn(
          'tw-absolute -tw-left-8 tw-top-1/2 tw-bg-slate-800 tw-w-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-tl-lg tw-rounded-bl-lg tw-cursor-pointer',
          {
            '!tw-hidden': !haveMediaSelectedID || response.loading,
          },
        )}
        onClick={() => setMediaSelectedData(null)}>
        <X color="#ffffff" size={18} />
      </div>
      <If
        isShow={response.loading}
        element={
          <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-50 tw-bg-slate-600/20 tw-backdrop-blur-md tw-flex tw-flex-col tw-items-center tw-justify-center">
            <Loader className="tw-animate-spin" size={30} />
            <p className="tw-mt-2">Đang lấy dữ liệu</p>
          </div>
        }
      />
      <If
        isShow={haveMediaSelectedID}
        element={() => (
          <div className="tw-flex tw-flex-col">
            <If
              isShow={type === MediaPackageType.VIDEO}
              element={
                <VideoPlayer
                  videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                  thumbnailUrl={mediaSelectedData?.data.avatar_thumb?.uri || ''}
                />
              }
            />

            <If
              isShow={type === MediaPackageType.IMAGE}
              element={
                <Image
                  src={mediaSelectedData?.data?.avatar_thumb?.uri || ''}
                  height="253px"
                  className="tw-rounded-none"
                />
              }
            />

            <div className="tw-flex tw-gap-2 tw-justify-between tw-bg-slate-600 tw-p-3">
              <div className="tw-flex tw-gap-4">
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Frame size={16} />
                  <span className="tw-text-xs">{`${mediaSelectedData?.data?.video?.width}x${mediaSelectedData?.data?.video?.height}`}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Ruler size={16} />
                  <span className="tw-text-xs">{formatBytes(mediaSelectedData?.data?.size as number)}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <CalendarFold size={16} />
                  <span className="tw-text-xs tw-capitalize">
                    {moment(mediaSelectedData?.data?.createdAt).format('dddd, DD/MM/YYYY HH:mm:ss')}
                  </span>
                </div>
              </div>

              <div className="tw-flex tw-gap-1 tw-items-center">
                <NotebookText size={16} />
              </div>
            </div>

            <div className="tw-flex tw-justify-between tw-px-3 tw-py-2">
              <div className="tw-gap-2 tw-flex">
                <Badge
                  onClick={() => setShowModal(true)}
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Images size={16} />
                  <span>Thay thumbnail</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Code size={16} />
                  <span>Mã nhúng</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400">
                  <Scissors size={16} />
                  <span>Cắt</span>
                </Badge>
              </div>
              <div className="tw-flex tw-gap-2">
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <Download size={16} />
                </div>
                <div className="tw-transition-all tw-w-[30px] tw-h-[30px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-slate-600 hover:tw-bg-slate-400 tw-cursor-pointer">
                  <MoreVertical size={16} />
                </div>
              </div>
            </div>
            <div className="tw-h-[1px] tw-bg-slate-700 tw-w-full"></div>
            <div className="tw-px-3 tw-py-2">
              <Accordion type="multiple" className="w-full">
                <Each
                  of={mediaAccords}
                  render={item => (
                    <If
                      isShow={!item.hide}
                      element={
                        <AccordionItem value={`item-${item.headerName}`} className="tw-border-slate-700">
                          <AccordionTrigger className="hover:tw-no-underline !tw-py-2">
                            {item.headerName}
                          </AccordionTrigger>
                          <AccordionContent className="tw-text-sm">
                            <ScrollArea className="tw-h-[210px] tw-pr-4">
                              <Form {...form}>
                                <form
                                  id="detail-media-form"
                                  onSubmit={form.handleSubmit(onSubmit)}
                                  className="tw-pt-3 tw-space-y-4 tw-px-1">
                                  <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tiêu đề</FormLabel>
                                        <FormControl>
                                          <Textarea className="!tw-bg-slate-900 tw-border-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Chú thích</FormLabel>
                                        <FormControl>
                                          <Textarea className="!tw-bg-slate-900 tw-border-none" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="right"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Bản quyền</FormLabel>
                                        <FormControl>
                                          <Input className="!tw-bg-slate-900 tw-border-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="isDrm"
                                    render={({ field }) => (
                                      <FormItem className="tw-flex tw-gap-3 tw-items-center">
                                        <FormControl>
                                          <Checkbox
                                            className="!tw-bg-slate-900"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                        <FormLabel className="!tw-m-0"> Video độc quyền?</FormLabel>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tác giả</FormLabel>
                                        <FormControl>
                                          <Input className="!tw-bg-slate-900 tw-border-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                      <FormItem {...field}>
                                        <FormLabel>Từ khoá</FormLabel>
                                        <FormControl>
                                          <MultiSelectField
                                            key={field.name}
                                            inputClassName="!tw-bg-slate-900 tw-border-none"
                                            name="tags"
                                            value={field.value}
                                            onChange={value => {
                                              field.onChange(value)
                                            }}
                                            options={[
                                              {
                                                value: 'remix',
                                                label: 'Remix',
                                              },
                                              {
                                                value: 'astro',
                                                label: 'Astro',
                                              },
                                              {
                                                value: 'wordpress',
                                                label: 'WordPress',
                                              },
                                              {
                                                value: 'express.js',
                                                label: 'Express.js',
                                              },
                                            ]}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="categoryIds"
                                    render={({ field }) => (
                                      <FormItem {...field}>
                                        <FormLabel>Chuyên mục</FormLabel>
                                        <FormControl>
                                          <MultiSelectChild
                                            value={field.value}
                                            inputClassName="!tw-bg-slate-900 tw-border-none"
                                            options={categoriesFiltered}
                                            // placeholder="Chọn chuyên mục..."
                                            // // value={listMediaQueries.categoryId}
                                            // value={field.value}
                                            onChange={field.onChange}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="types"
                                    render={({ field }) => (
                                      <FormItem {...field}>
                                        <FormLabel>Thể loại</FormLabel>
                                        <FormControl>
                                          <MultiSelectField
                                            key={field.name}
                                            inputClassName="!tw-bg-slate-900 tw-border-none"
                                            name="tags"
                                            onChange={value => {
                                              field.onChange(value)
                                            }}
                                            options={[
                                              {
                                                value: 'remix',
                                                label: 'Remix',
                                              },
                                              {
                                                value: 'astro',
                                                label: 'Astro',
                                              },
                                              {
                                                value: 'wordpress',
                                                label: 'WordPress',
                                              },
                                              {
                                                value: 'express.js',
                                                label: 'Express.js',
                                              },
                                            ]}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </form>
                              </Form>
                            </ScrollArea>
                          </AccordionContent>
                        </AccordionItem>
                      }
                    />
                  )}
                />
              </Accordion>
            </div>
            <div className="tw-absolute tw-gap-3 tw-bottom-0 tw-w-full tw-flex tw-items-center tw-justify-center">
              <Button form="detail-media-form" type="submit">
                Submit
              </Button>
              <Button
                onClick={() => {
                  if (onExportData) {
                    if (!mediaSelectedData) return onExportData([])
                    return onExportData([mediaSelectedData.data])
                  }
                }}>
                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <CircleFadingPlus size={16} />
                  <span>Chèn</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      />
      {
        <AlertDialog open={showModal} onOpenChange={status => setShowModal(status)}>
          {/* <AlertDialogContent className="!tw-max-w-[65vw] tw-min-h-[300px] tw-h-[750px]"> */}
          <AlertDialogContent className="tw-max-w-[70vw] tw-overflow-y-scroll tw-max-h-[800px] !tw-inline-table !tw-p-0 !tw-m-0 !tw-border-none">
            <AlertDialogHeader className="!tw-block">
              <AlertDialogTitle className="tw-px-3 tw-pt-2 tw-flex tw-justify-between tw-items-center">
                <span>Thay Thumbnail</span>
                <X size={20} className="tw-cursor-pointer" onClick={() => setShowModal(false)} />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className=" tw-bg-black">
                  <div className="tw-max-w-[60%] tw-mx-auto !tw-pb-[1px]">
                    <If
                      isShow={type === MediaPackageType.VIDEO}
                      element={
                        <VideoPlayer
                          videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                          thumbnailUrl={avatarSelected || mediaSelectedData?.data?.avatar_thumb?.uri || ''}
                        />
                      }
                    />
                  </div>
                </div>

                <div className="tw-max-w-[70vw] tw-bg-[#434242] tw-pt-5">
                  <div className="tw-flex">
                    <div className="tw-flex tw-max-w-[70vw]">
                      <ListThumb
                        onUploadThumb={onUploadThumb}
                        onSelectThumb={url => setAvatarSelected(url)}
                        avatarSelected={avatarSelected}
                        items={mediaSelectedData?.data?.avatar_thumb?.url_list || []}
                      />
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!tw-justify-center !tw-py-2 tw-items-center !tw-flex-row !tw-flex tw-gap-3">
              <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmitThumb} className="!tw-bg-green-600 !hover:tw-bg-green-700">
                Hoàn Thành
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </div>
  )
}

export default Detail
