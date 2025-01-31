import { Button } from '@/components/Button'
import React, { useState, useEffect } from 'react'

interface CookieConsentProps {
  onAccept?: () => void
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent')
    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
    onAccept?.()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 w-full sm:left-8 sm:w-96 sm:bottom-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] bg-white rounded-none sm:rounded-sm ">
      <div className="px-4 py-4 sm:py-6 flex flex-row gap-6 items-center justify-center">
        <div className="">
          <h3 className="text-base font-semibold text-zinc-900 ">Сайт использует куки</h3>
        </div>

        <Button onClick={handleAccept} variant={'white'} size={'sm'} className="rounded-sm px-8">
          ОК
        </Button>
      </div>
    </div>
  )
}

export default CookieConsent
