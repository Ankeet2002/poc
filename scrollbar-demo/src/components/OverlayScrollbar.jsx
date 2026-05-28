import { useCallback, useEffect, useRef, useState } from 'react'
import SampleContent from './SampleContent'

export default function OverlayScrollbarDemo({ itemCount }) {
  const contentRef = useRef(null)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const [visible, setVisible] = useState(false)

  const updateThumb = useCallback(() => {
    const el = contentRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const hasOverflow = scrollHeight > clientHeight

    if (!hasOverflow) {
      setVisible(false)
      return
    }

    setVisible(true)
    const ratio = clientHeight / scrollHeight
    const height = Math.max(ratio * clientHeight, 24)
    const maxTop = clientHeight - height
    const top =
      scrollHeight - clientHeight === 0
        ? 0
        : (scrollTop / (scrollHeight - clientHeight)) * maxTop

    setThumbHeight(height)
    setThumbTop(top)
  }, [])

  useEffect(() => {
    updateThumb()
    const el = contentRef.current
    if (!el) return

    el.addEventListener('scroll', updateThumb, { passive: true })
    const ro = new ResizeObserver(updateThumb)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', updateThumb)
      ro.disconnect()
    }
  }, [itemCount, updateThumb])

  return (
    <div className="overlay-scrollbar-wrapper">
      <div
        ref={contentRef}
        className="overlay-scrollbar-content"
        onScroll={updateThumb}
      >
        <SampleContent itemCount={itemCount} />
      </div>
      {visible && (
        <div className="overlay-scrollbar-track" aria-hidden="true">
          <div
            className="overlay-scrollbar-thumb"
            style={{ height: thumbHeight, transform: `translateY(${thumbTop}px)` }}
          />
        </div>
      )}
    </div>
  )
}
