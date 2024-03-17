/* eslint-disable no-restricted-syntax */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
export class CancelError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CancelError'
  }

  public get isCancelled(): boolean {
    return true
  }
}

export interface OnCancel {
  readonly isResolved: boolean
  readonly isRejected: boolean
  readonly isCancelled: boolean

  (cancelHandler: () => void): void
}

export class CancelablePromise<T> implements Promise<T> {
  readonly [Symbol.toStringTag]: string = ''

  _isResolved: boolean
  _isRejected: boolean
  _isCancelled: boolean
  readonly _cancelHandlers: (() => void)[]
  readonly _promise: Promise<T>
  _resolve?: (value: T | PromiseLike<T>) => void
  _reject?: (reason?: any) => void

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
      onCancel: OnCancel,
    ) => void,
  ) {
    this._isResolved = false
    this._isRejected = false
    this._isCancelled = false
    this._cancelHandlers = []
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject

      const onResolve = (value: T | PromiseLike<T>): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this._isResolved = true
        this._resolve?.(value)
      }

      const onReject = (reason?: any): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this._isRejected = true
        this._reject?.(reason)
      }

      const onCancel = (cancelHandler: () => void): void => {
        if (this._isResolved || this._isRejected || this._isCancelled) {
          return
        }
        this._cancelHandlers.push(cancelHandler)
      }

      Object.defineProperty(onCancel, 'isResolved', {
        get: (): boolean => this._isResolved,
      })

      Object.defineProperty(onCancel, 'isRejected', {
        get: (): boolean => this._isRejected,
      })

      Object.defineProperty(onCancel, 'isCancelled', {
        get: (): boolean => this._isCancelled,
      })

      return executor(onResolve, onReject, onCancel as OnCancel)
    })
  }

  public then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onFulfilled, onRejected)
  }

  public catch<TResult = never>(
    onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    return this._promise.catch(onRejected)
  }

  public finally(onFinally?: (() => void) | null): Promise<T> {
    return this._promise.finally(onFinally)
  }

  public cancel(): void {
    if (this._isResolved || this._isRejected || this._isCancelled) {
      return
    }
    this._isCancelled = true
    if (this._cancelHandlers.length) {
      try {
        for (const cancelHandler of this._cancelHandlers) {
          cancelHandler()
        }
      } catch (error) {
        console.warn('Cancellation threw an error', error)
        return
      }
    }
    this._cancelHandlers.length = 0
    // this._reject?.(new CancelError('Request aborted'))
  }

  public get isCancelled(): boolean {
    return this._isCancelled
  }
}
