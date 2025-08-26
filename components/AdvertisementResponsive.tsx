import { useEffect, useRef } from 'react'

// Declare adsbygoogle on window object
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export const AdvertisementResponsive = ({ className = '' }) => {
  const adRef = useRef(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    if (isLoaded.current) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      isLoaded.current = true
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1161412231963156"
        data-ad-slot="5565156947"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
