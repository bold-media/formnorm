import { Post, Project, Service, Term } from '@payload-types'

export type DataTypeMap = {
  post: Post | string | null | undefined
  term: Term | string | null | undefined
  service: Service | string | null | undefined
  project: Project | string | null | undefined
}

export type PreviewCardProps<T extends keyof DataTypeMap> = {
  data: DataTypeMap[T]
  type: T
}
