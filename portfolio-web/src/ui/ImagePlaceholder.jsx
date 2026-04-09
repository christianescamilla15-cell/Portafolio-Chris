import { useState } from 'react'

/**
 * ImagePlaceholder — shimmer placeholder that fades in once the image loads.
 * Prevents CLS and provides a polished loading experience.
 */
export default function ImagePlaceholder({ src, alt, width, height, style, className }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
        borderRadius: 12,
        ...style,
      }}
    >
      {/* Shimmer placeholder */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      {src && (
        <img
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}
    </div>
  )
}
