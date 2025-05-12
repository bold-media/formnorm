import { getSettings } from '@/modules/common/data'
import { LivePreviewListener } from '@/modules/layout/LivePreviewListener'
import { generateMeta } from '@/utils/generateMeta'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import { ExitPreview } from '@/modules/layout/ExitPreview'
import { Montserrat } from 'next/font/google'
import { cn } from '@/utils/cn'
import { Header } from '@/modules/layout/Header'
import { Footer } from '@/modules/layout/Footer'
import { Toaster } from '@/components/Sonner'
import { ClientCookieConsent } from '@/modules/layout/ClientCookies'
import { YandexMetrika } from '@/modules/layout/YandexMetrika'

const montserrat = Montserrat({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { isEnabled: draft } = await draftMode()
  const settings = await getSettings()

  return (
    <html lang="ru">
      <body
        className={cn(
          montserrat.variable,
          'relative bg-background font-sans antialiased min-h-screen flex flex-col',
        )}
      >
        <div className="flex flex-col flex-grow">
          {draft && (
            <>
              <LivePreviewListener />
              <ExitPreview />
            </>
          )}
          <Header className="flex-shrink-0" links={settings?.navigation?.header?.links} />

          <main className="flex-grow pt-header">{children}</main>
          <Footer className="flex-shrink-0" data={settings?.navigation?.footer} />
        </div>
        <Toaster />
        <ClientCookieConsent />
        <YandexMetrika />
      </body>
    </html>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSettings()

  if (!settings) {
    notFound()
  }
  return generateMeta({ meta: settings?.seo })
}

export default RootLayout
