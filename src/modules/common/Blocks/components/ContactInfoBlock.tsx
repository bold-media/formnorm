import { ContactInfoBlockType } from '@payload-types'
import React from 'react'
import { RichText } from '@/modules/common/RichText'
import { AspectRatio } from '@/components/AspectRatio'
import Image from 'next/image'
import { Button } from '@/components/Button'
import Link from 'next/link'
import { getLinkProps } from '@/utils/getLinkProps'
import WhatsappIcon from '@/assets/whatsapp-icon.svg'
import TelegramIcon from '@/assets/telegram-icon.svg'
import EmailIcon from '@/assets/email-icon.svg'

export const ContactInfoBlock = (props: ContactInfoBlockType) => {
  const { image, text, links } = props
  if (!image || typeof image !== 'object' || !image?.url) return null

  return (
    <div className="flex flex-col w-full gap-10 my-14">
      <div className="flex flex-col sm:flex-row gap-10 items-center">
        <div className="w-64 sm:w-3/5 md:w-2/5 h-full not-prose">
          <AspectRatio ratio={1} className="rounded-full sm:rounded-none overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt}
              fill={true}
              draggable={false}
              className="flex-1 select-none object-contain object-center"
            />
          </AspectRatio>
        </div>
        <RichText data={text} container={false} className="flex-1 text-center sm:text-left" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {links &&
          Object.entries(links).map(([type, link]) =>
            link ? (
              <Button key={type} variant="outline" className="w-full sm:flex-1 border-zinc-900">
                <Link {...getLinkProps(link)}>
                  {type === 'whatsapp' && <WhatsappIcon className="w-6 h-6" />}
                  {type === 'telegram' && <TelegramIcon className="w-6 h-6" />}
                  {type === 'email' && <EmailIcon className="w-6 h-6" />}
                </Link>
              </Button>
            ) : null,
          )}
      </div>
    </div>
  )
}
