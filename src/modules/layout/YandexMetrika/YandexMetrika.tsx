'use client'
/* eslint-disable @next/next/no-img-element */
import Script, { ScriptProps } from 'next/script'
import React, { useEffect, useMemo, type ReactNode } from 'react'
import { InitParameters } from './types'
import { ym } from './ym'
import { usePathname } from 'next/navigation'

interface Props {
  tagID?: number
  strategy?: ScriptProps['strategy']
  initParameters?: InitParameters
  shouldUseAlternativeCDN?: boolean
}

export const YandexMetrika = ({
  tagID,
  strategy = 'afterInteractive',
  initParameters,
  shouldUseAlternativeCDN,
}: Props) => {
  const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  const id = useMemo(() => {
    return tagID || (YANDEX_METRIKA_ID ? Number(YANDEX_METRIKA_ID) : null)
  }, [YANDEX_METRIKA_ID, tagID])

  const pathname = usePathname()

  useEffect(() => {
    if (ym) {
      ym(id, 'hit', pathname)
    }
  }, [id, pathname])

  if (!id) {
    return null
  }

  const scriptSrc = shouldUseAlternativeCDN
    ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js'
    : 'https://mc.yandex.ru/metrika/tag.js'

  return (
    <>
      <Script id="yandex-metrica" strategy={strategy} type="text/javascript">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "${scriptSrc}", "ym");
          ym(${id}, "init", ${JSON.stringify(initParameters || {})});
        `}
      </Script>
      <noscript id="yandex-metrica-pixel">
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://mc.yandex.ru/watch/${tagID}`}
          alt=""
        />
      </noscript>
    </>
  )
}
