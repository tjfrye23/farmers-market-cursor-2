import React from 'react'
import { Globe, Facebook, Instagram, Twitter } from 'lucide-react'

function formatSocialUrl(platform: string, handle: string) {
  if (!handle) return ''
  if (handle.startsWith('http')) return handle
  const cleanHandle = handle.replace('@', '')
  switch (platform) {
    case 'facebook':
      return `https://facebook.com/${cleanHandle}`
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`
    case 'twitter':
      return `https://twitter.com/${cleanHandle}`
    case 'youtube':
      return `https://youtube.com/${cleanHandle}`
    default:
      return handle
  }
}

interface VendorSocialLinksProps {
  websiteUrl?: string | null
  facebookHandle?: string | null
  instagramHandle?: string | null
  twitterHandle?: string | null
  youtubeHandle?: string | null
  businessName: string
}

export const VendorSocialLinks: React.FC<VendorSocialLinksProps> = ({
  websiteUrl,
  facebookHandle,
  instagramHandle,
  twitterHandle,
  youtubeHandle,
  businessName,
}) => {
  if (
    !websiteUrl &&
    !facebookHandle &&
    !instagramHandle &&
    !twitterHandle &&
    !youtubeHandle
  )
    return null
  return (
    <div className="mb-6">
      <h3 className="text-market-green-dark mb-3 text-lg font-semibold">
        Connect with {businessName}
      </h3>
      <div className="flex flex-wrap gap-3">
        {websiteUrl && (
          <a
            href={
              websiteUrl.startsWith('http')
                ? websiteUrl
                : `https://${websiteUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
        {facebookHandle && (
          <a
            href={formatSocialUrl('facebook', facebookHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-900"
          >
            <Facebook className="h-4 w-4" />
          </a>
        )}
        {instagramHandle && (
          <a
            href={formatSocialUrl('instagram', instagramHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-2 text-pink-700 transition-colors hover:bg-pink-100 hover:text-pink-900"
          >
            <Instagram className="h-4 w-4" />
          </a>
        )}
        {twitterHandle && (
          <a
            href={formatSocialUrl('twitter', twitterHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sky-700 transition-colors hover:bg-sky-100 hover:text-sky-900"
          >
            <Twitter className="h-4 w-4" />
          </a>
        )}
        {youtubeHandle && (
          <a
            href={formatSocialUrl('youtube', youtubeHandle)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-700 transition-colors hover:bg-red-100 hover:text-red-900"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
