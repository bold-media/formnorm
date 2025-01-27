// @ts-nocheck
'use server'
import { ArchiveBlockType, Config, Project } from '@payload-types'
import React from 'react'
import { getArchive } from '../../data'
import { cn } from '@/utils/cn'
import { PreviewCard } from '../../PreviewCard'
import { getAllProjects } from '@/modules/project/data'

const isProject = (item: any): item is Config['collections']['project'] => {
  return typeof item === 'object' && item !== null && 'id' in item
}

export const ArchiveBlock = async (props: ArchiveBlockType) => {
  const { type } = props

  if (!type) return null

  const archive = await getArchive({ collection: type })
  const { count } = props

  return (
    <div
      className={cn('grid', {
        'grid-cols-1 md:grid-cols-2 gap-10': type === 'project',
      })}
    >
      {Array.isArray(archive) &&
        archive?.map((item) => {
          if (type === 'project' && isProject(item)) {
            return (
              <div key={item.id}>
                <PreviewCard key={item.id} data={item} type="project" />
              </div>
            )
          }

          return null
        })}
    </div>
  )
}
