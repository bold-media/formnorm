'use server'
import { ProjectsBlockType } from '@payload-types'
import React from 'react'
import { PreviewCard } from '../../PreviewCard'
import { cn } from '@/utils/cn'
import { getPayload } from 'payload'
import config from '@payload-config'

const getProjects = async () => {
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({
    collection: 'project',
    overrideAccess: false,
    limit: 0,
    pagination: false,
    disableErrors: true,
  })
  return projects
}

export const ProjectsBlock = async (props: ProjectsBlockType) => {
  const { count } = props
  const projects = await getProjects()
  return (
    <div className="overflow-x-hidden">
      <div className={cn('container mt-8 sm:mt-16 min-h-svh')}>
        {projects && Array.isArray(projects) && (
          <div className="grid sm:grid-cols-3 gap-10">
            {projects.map((project: any) => (
              <PreviewCard key={project.id} data={project} type="project" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default ProjectsBlock
