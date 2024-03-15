import { MultiSelect } from '@/src/components/common/multi-select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
import { Badge } from '@/src/components/ui/badge';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Textarea } from '@/src/components/ui/textarea';
import If from '@/src/hooks/if';
import { useDetailMedia } from '@/src/hooks/useMedia';
import { formatDate } from '@/src/lib/utils/date';
import { avatarUrl, formatBytes } from '@/src/lib/utils/media';
import { cn } from '@/src/lib/utils/merge-class';
import { MediaCodec, MediaPacks, Video } from '@/src/types';
import { zodResolver } from '@hookform/resolvers/zod';
import useAppStore, { TabItemType } from '@/src/stores/useAppStore';
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
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import moment from 'moment';
import { Button } from '@/src/components/ui/button';
import VideoPlayer from '@/src/components/common/video-player';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Description must be at least 2 characters.',
  }),
  right: z.string().min(2, {
    message: 'Right must be at least 2 characters.',
  }),
  isDrm: z.boolean(),
  author: z.string().min(2, {
    message: 'Author must be at least 2 characters.',
  }),
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  types: z.array(z.string()),
});

const Detail = () => {
  const {
    mediaSelectedID,
    mediaSelectedData,
    setMediaSelectedData,
    tabActivated,
  } = useAppStore();
  const { response, getDetailMedia } = useDetailMedia();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      title: '',
      description: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

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
  ];

  const videoUrl = (d?: Video) => {
    if (!d) return;
    const defaultUri = d?.uri;
    const hls = d.play_url.hls;
    if (!hls || !hls.length) return defaultUri;
    const item = hls.find(
      (val) => val.codec === MediaCodec.H264 && val.pack === MediaPacks.HLS
    );
    if (!item) return defaultUri;
    return item.uri;
  };

  const haveMediaSelectedID = useMemo(
    () => mediaSelectedID !== null && mediaSelectedID !== '',
    [mediaSelectedID]
  );

  useEffect(() => {
    if (mediaSelectedID) {
      getDetailMedia(mediaSelectedID);
    }
  }, [mediaSelectedID]);

  return (
    <div
      className={cn(
        'tw-bg-slate-800 tw-text-white tw-relative tw-h-full tw-w-full tw-flex-none tw-transition-all',
        {
          'tw-max-w-[450px]': haveMediaSelectedID,
          'tw-max-w-0': !haveMediaSelectedID,
        }
      )}
    >
      <div
        className={cn(
          'tw-absolute -tw-left-8 tw-top-1/2 tw-bg-slate-800 tw-w-8 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-tl-lg tw-rounded-bl-lg tw-cursor-pointer',
          {
            '!tw-hidden': !haveMediaSelectedID || response.loading,
          }
        )}
        onClick={() => setMediaSelectedData(null)}
      >
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
            {tabActivated === TabItemType.VIDEO ? (
              <VideoPlayer
                videoUrl={videoUrl(mediaSelectedData?.data.video) as string}
                thumbnailUrl={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
              />
            ) : (
              <img
                className="tw-h-[253px] tw-object-contain"
                src={avatarUrl(mediaSelectedData?.data.avatar_thumb)}
              />
            )}
            <div className="tw-flex tw-gap-2 tw-justify-between tw-bg-slate-600 tw-p-3">
              <div className="tw-flex tw-gap-4">
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Frame size={16} />
                  <span className="tw-text-xs">{`${mediaSelectedData?.data?.video?.width}x${mediaSelectedData?.data?.video?.height}`}</span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <Ruler size={16} />
                  <span className="tw-text-xs">
                    {formatBytes(mediaSelectedData?.data?.size as number)}
                  </span>
                </div>
                <div className="tw-flex tw-gap-1 tw-items-center">
                  <CalendarFold size={16} />
                  <span className="tw-text-xs tw-capitalize">
                    {moment(mediaSelectedData?.data?.createdAt).format(
                      'dddd, DD/MM/YYYY HH:mm:ss'
                    )}
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
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
                  <Images size={16} />
                  <span>Thay thumbnail</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
                  <Code size={16} />
                  <span>Mã nhúng</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="tw-h-[30px] tw-flex tw-items-center tw-justify-center tw-gap-1 tw-cursor-pointer tw-bg-slate-600 tw-text-white hover:tw-bg-slate-400"
                >
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
                {mediaAccords.map((item, index: number) =>
                  !item.hide ? (
                    <AccordionItem
                      value={`item-${index}`}
                      key={index}
                      className="tw-border-slate-700"
                    >
                      <AccordionTrigger className="hover:tw-no-underline !tw-py-2">
                        {item.headerName}
                      </AccordionTrigger>
                      <AccordionContent className="!tw-pt-5 tw-px-2 tw-text-sm ">
                        <ScrollArea className="tw-h-[250px] tw-pr-5">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="tw-pt-3 tw-space-y-8 tw-px-3"
                            >
                              <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        className="!tw-bg-black tw-border-none"
                                        {...field}
                                      />
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
                                      <Textarea
                                        className="!tw-bg-black tw-border-none"
                                        {...field}
                                      />
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
                                      <Input
                                        className="!tw-bg-black tw-border-none"
                                        {...field}
                                      />
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
                                        className="!tw-bg-black"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="!tw-m-0">
                                      {' '}
                                      Video độc quyền?
                                    </FormLabel>
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
                                      <Input
                                        className="!tw-bg-black tw-border-none"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Chuyên mục</FormLabel>
                                    <FormControl>
                                      <MultiSelect
                                        inputClassName="!tw-bg-black tw-border-none"
                                        selected={[]}
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
                                        onChange={(value) => {
                                          console.log(value);
                                        }}
                                        // className="!tw-bg-black tw-border-none"
                                        // {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Thể loại</FormLabel>
                                    <FormControl>
                                      <MultiSelect
                                        inputClassName="!tw-bg-black tw-border-none"
                                        selected={[]}
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
                                        onChange={(value) => {
                                          console.log(value);
                                        }}
                                        // className="!tw-bg-black tw-border-none"
                                        // {...field}
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
                                  <FormItem>
                                    <FormLabel>Thể loại</FormLabel>
                                    <FormControl>
                                      <MultiSelect
                                        inputClassName="!tw-bg-black tw-border-none"
                                        selected={[]}
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
                                        onChange={(value) => {
                                          console.log(value);
                                        }}
                                        // className="!tw-bg-black tw-border-none"
                                        // {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <Button className="tw-mt-5" type="submit">
                                Submit
                              </Button>
                            </form>
                          </Form>
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  ) : null
                )}
              </Accordion>
            </div>
            <div className="tw-absolute tw-bottom-0 tw-w-full tw-flex tw-items-center tw-justify-center">
              <Button>
                <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
                  <CircleFadingPlus size={16} />
                  <span>Chèn</span>
                </div>
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Detail;
