import { Button } from '@/components/Button'
import Link from 'next/link'
import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="container mt-header min-h-page py-20 lg:pt-20 lg:pb-32 content-center text-center flex flex-col justify-center gap-12 sm:gap-[3.375rem] lg:gap-[3.75rem]">
      <div className="flex justify-center items-center text-xs sm:text-sm md:text-base uppercase text-zinc-600 font-semibold tracking-[0.156rem]">
        Страница не найдена
      </div>
      <div className="text-8xl font-semibold">404</div>
      <div className="prose leading-[1.7] font-light text-xl sm:text[1.375rem] md:text-2xl">
        <p className="">Мы уверены, вы найдете то, что ищете на нашем сайте!</p>
      </div>

      <Button
        variant="white"
        asChild
        className="uppercase font-medium mx-auto py-7 px-14 text-base"
      >
        <Link href="/">На главную</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
