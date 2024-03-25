export interface HookState<T> {
  loading: boolean
  data: null | T
  err: null | Error
}

export enum MediaPackageType {
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document',
}

export interface ComboboxOption {
  label: string
  value: string
  children: Array<ComboboxOption> | null
}

export enum SideMenuActive {
  FILTER = 'filter',
  LOCAL_FILES = 'local-file',
  LINK = 'link',
  WATCH_FOLDER = 'watch-folder',
  S3_STORAGE = 's3-storage',
  NULL = 'null',
}
export type SideMenu = {
  active: SideMenuActive
}

export enum OrderType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum MediaPacks {
  HLS = 'HLS',
  DASH = 'DASH',
}

export enum MediaCodec {
  H264 = '264',
  H265 = '265',
}

export enum GetListMediaTimeRange {
  ALL = 'all',
  '24h' = '24h',
  '7d' = '7d',
  '30d' = '30d',
  '1y' = '1y',
  'custom' = 'custom',
}

export enum OrderByType {
  CREATED_AT = 'createdAt',
  NAME = 'name',
}

export enum MediaStatus {
  Done = 'DONE',
  Error = 'ERROR',
  Transcoding = 'TRANSCODING',
  Uploaded = 'UPLOADED',
  Uploading = 'UPLOADING',
}

export enum FileType {
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document',
}

export interface AvatarThumb {
  uri: string
  url_list: string[]
}

export interface Video {
  uri: string
  width: number
  height: number
  play_url: PlayUrl
}

export interface PlayUrl {
  mp4: Mp4[]
  hls: Hl[]
}

export interface Mp4 {
  uri?: string
  width: number
  height: number
  name: string
  codec: string
  video_bitrate: number
  audio_bitrate: number
  status: string
}

export interface Hl {
  uri?: string
  codec: string
  pack: string
  status: string
}

export interface Meta {
  page: number
  take: number
  itemCount: number
  pageCount: number
}

export interface MediaEntity {
  id: string
  name: string
  description: string
  file_name: string
  mime_type: string
  size: number
  durations: number
  status: string
  avatar_thumb: AvatarThumb
  download_addr: AvatarThumb
  video: Video
  tags?: string[]
  createdAt: string
  updatedAt: string
  categories: Category[]
  width: number
  height: number
}

export interface GetListMediaRequest {
  order: OrderType
  page: number
  take: number
  orderBy: OrderByType
  keyword?: string
  timeRange?: GetListMediaTimeRange
  startDate?: string
  endDate?: string
  categoryId?: string
  fileType?: FileType
  isMyFile: boolean
}
export interface GetListMediaResponse {
  data: MediaEntity[]
  meta: Meta
}

export interface GetDetailMediaResponse {
  data: MediaEntity
  success: boolean
}

export interface Category {
  id: string
  name: string
  description?: string
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface GetListCategoriesResponse {
  success: boolean
  data: Category[]
}

export interface ConfigResponse {
  success: boolean
  data: ConfigEntity
}

export interface ConfigEntity {
  organizationId: string
  templateId: string
}

export interface FileAdded {
  id: string
  contentId: string
  name: string
}

export interface FileProgressType {
  id: string
  percent: number
}

export interface UpdateMediaInput {
  name: string
  description: string
  avatar: string
  categoryIds: string[]
  tags: string[]
}

export type MenuImgEditorType =
  | 'rotate'
  | 'flip'
  | 'crop'
  | 'draw'
  | 'shape'
  | 'icon'
  | 'text'
  | 'mask'
  | 'filter'
  | 'reset'
  | 'resize'
