import { useEffect, useRef, useState } from 'react'

let mermaidPromise

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        themeVariables: {
          primaryColor: '#f5e9ec',
          primaryTextColor: '#3d0f1d',
          primaryBorderColor: '#7a1f3d',
          lineColor: '#a6798a',
          secondaryColor: '#faf3f5',
          tertiaryColor: '#ffffff',
          attributeBackgroundColorOdd: '#ffffff',
          attributeBackgroundColorEven: '#faf3f5',
          entityBorder: '#7a1f3d',
          nodeBorder: '#7a1f3d',
          fontSize: '14px'
        }
      })
      return mermaid
    })
  }
  return mermaidPromise
}

let idCounter = 0

export default function Mermaid({ chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    idCounter += 1
    const id = `mermaid-diagram-${idCounter}`

    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart.trim()))
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return <pre style={{ color: '#a32d2d', fontSize: '0.85rem' }}>다이어그램 렌더링 오류: {error}</pre>
  }

  return <div ref={ref} style={{ overflowX: 'auto', margin: '1.5rem 0', textAlign: 'center' }} />
}
