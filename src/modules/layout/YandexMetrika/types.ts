export interface VisitParameters {
  order_price?: number
  currency?: string
  [key: string]: number | string | undefined
}

export interface UserParameters {
  UserID?: number
  [key: string]: number | string | undefined
}

export interface ExtLinkOptions {
  callback?: () => void
  params?: VisitParameters
  title?: string
}

export interface FileOptions {
  callback?: () => void
  params?: VisitParameters
  referer?: string
  title?: string
}

export interface HitOptions {
  callback?: () => void
  params?: VisitParameters
  referer?: string
  title?: string
}

export interface NotBounceOptions {
  callback?: () => void
}

export interface InitParameters {
  accurateTrackBounce?: boolean | number
  childIframe?: boolean
  clickmap?: boolean
  defer?: boolean
  ecommerce?: boolean | string | any[]
  params?: VisitParameters | VisitParameters[]
  userParams?: UserParameters
  trackHash?: boolean
  trackLinks?: boolean
  trustedDomains?: string[]
  type?: number
  webvisor?: boolean
  triggerEvent?: boolean
}

export interface FirstPartyParamsParameters {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  home_address?: string
  street?: string
  city?: string
  region?: string
  postal_code?: string
  country?: string
  yandex_cid?: number
}

export interface InitParameters {
  accurateTrackBounce?: boolean | number
  childIframe?: boolean
  clickmap?: boolean
  defer?: boolean
  ecommerce?: boolean | string | any[]
  params?: VisitParameters | VisitParameters[]
  userParams?: UserParameters
  trackHash?: boolean
  trackLinks?: boolean
  trustedDomains?: string[]
  type?: number
  webvisor?: boolean
  triggerEvent?: boolean
}

export interface FirstPartyParamsParameters {
  email?: string
  phone_number?: string
  first_name?: string
  last_name?: string
  home_address?: string
  street?: string
  city?: string
  region?: string
  postal_code?: string
  country?: string
  yandex_cid?: number
}

type InitEventParameters = [eventName: 'init', parameters: InitParameters]

type AddFileExtensionEventParameters = [
  eventName: 'addFileExtension',
  extensions: string | string[],
]

type ExtLinkEventParameters = [eventName: 'extLink', url: string, options?: ExtLinkOptions]

type FileEventParameters = [eventName: 'file', url: string, options?: FileOptions]

type FirstPartyParamsEventParameters = [
  eventName: 'firstPartyParams',
  parameters: FirstPartyParamsParameters,
]

type GetClientIDEventParameters = [eventName: 'getClientID', cb: (clientID: string) => void]

type HitEventParameters = [eventName: 'hit', url: string, options?: HitOptions]

type NotBounceEventParameters = [eventName: 'notBounce', options?: NotBounceOptions]

type ParamsEventParameters = [eventName: 'params', parameters: VisitParameters | VisitParameters[]]

type ReachGoalEventParameters = [
  eventName: 'reachGoal',
  target: string,
  params?: VisitParameters,
  callback?: () => void,
]

type SetUserIDEventParameters = [eventName: 'setUserID', userID: string]

type UserParamsEventParameters = [eventName: 'userParams', parameters: UserParameters]

export type EventParameters =
  | InitEventParameters
  | AddFileExtensionEventParameters
  | ExtLinkEventParameters
  | FileEventParameters
  | FirstPartyParamsEventParameters
  | GetClientIDEventParameters
  | HitEventParameters
  | NotBounceEventParameters
  | ParamsEventParameters
  | ReachGoalEventParameters
  | SetUserIDEventParameters
  | UserParamsEventParameters

export type YM = (tagID: number, ...parameters: EventParameters) => void
