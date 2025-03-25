import { type YM, type EventParameters } from './types'

declare global {
  interface Window {
    ym: (id: number, action: string, params?: any) => void
  }
}

export const ym = (tagID: number | null, ...parameters: EventParameters) => {
  const ym = window?.ym as YM | undefined

  if (!ym || !tagID) {
    return
  }

  ym(tagID, ...parameters)
}
