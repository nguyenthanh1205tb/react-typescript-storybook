export const wait = (time: number) => {
  return new Promise<boolean>(resolve =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => resolve(true), time),
  )
}
