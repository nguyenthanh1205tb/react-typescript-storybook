export interface HookState<T> {
  loading: boolean
  data: null | T
  err: null | Error
}
