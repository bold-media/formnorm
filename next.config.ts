import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import withBundleAnalyzer from '@next/bundle-analyzer'

const config: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    )
    fileLoaderRule.exclude = /\.svg$/i
    
    // Fix for pdfmake
    config.resolve.alias = {
      ...config.resolve.alias,
      // These modules are not needed for server-side PDF generation
      'canvg': false,
      'html2canvas': false,
      'dompurify': false
    }
    
    // Handle binary files for pdfmake and pdfkit
    config.module.rules.push({
      test: /\.(trie|afm)$/,
      type: 'asset/resource'
    })
    
    // Exclude PDFKit from webpack parsing
    config.externals = {
      ...config.externals,
      'pdfkit': 'commonjs pdfkit'
    }
    
    return config
  },
  output: 'standalone',
}

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(withPayload(config))
