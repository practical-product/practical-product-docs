import { useEffect, useRef, useState } from 'react'

let mermaidPromise
let panZoomPromise

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = mod.default
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        securityLevel: 'loose',
        er: {
          diagramPadding: 28,
          layoutDirection: 'TB',
          minEntityWidth: 160,
          minEntityHeight: 100,
          entityPadding: 20,
          fontSize: 16,
          useMaxWidth: false
        },
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
          fontSize: '15px'
        }
      })
      return mermaid
    })
  }
  return mermaidPromise
}

function loadPanZoom() {
  if (!panZoomPromise) {
    panZoomPromise = import('svg-pan-zoom').then((mod) => mod.default || mod)
  }
  return panZoomPromise
}

let idCounter = 0

export default function Mermaid({ chart }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let panZoomInstance
    idCounter += 1
    const id = `mermaid-diagram-${idCounter}`

    Promise.all([loadMermaid(), loadPanZoom()])
      .then(([mermaid, svgPanZoom]) => {
        const normalized = chart.trim().replace(/^erDiagram\s*/, 'erDiagram\n')
        return mermaid.render(id, normalized).then(({ svg }) => {
          if (cancelled || !containerRef.current) return
          containerRef.current.innerHTML = svg
          const svgEl = containerRef.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.maxWidth = 'none'
            svgEl.style.width = '100%'
            svgEl.style.height = '100%'
            svgEl.querySelectorAll('.er.entityLabel, text.er.entityLabel').forEach((t) => {
              t.style.fontWeight = '700'
            })
            panZoomInstance = svgPanZoom(svgEl, {
              zoomEnabled: true,
              panEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.3,
              maxZoom: 8
            })
          }
        })
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
      if (panZoomInstance) panZoomInstance.destroy()
    }
  }, [chart])

  if (error) {
    return <pre style={{ color: '#a32d2d', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>다이어그램 렌더링 오류: {error}</pre>
  }

  return (
    <div>
      <style>{`
        .mermaid-erd-wrap .er.entityLabel {
          font-weight: 700 !important;
        }
        .mermaid-erd-wrap text {
          font-family: 'Pretendard', -apple-system, sans-serif !important;
        }
        .mermaid-erd-wrap svg {
          cursor: grab;
        }
      `}</style>
      <div
        ref={containerRef}
        className="mermaid-erd-wrap"
        style={{
          overflow: 'hidden',
          margin: '1.5rem 0',
          border: '1px solid #e5d5da',
          borderRadius: '12px',
          background: '#fff',
          height: '620px'
        }}
      />
      <div style={{ fontSize: '0.8rem', color: '#8a8a8a', textAlign: 'center', marginTop: '0.5rem' }}>
        마우스 휠로 확대·축소, 드래그로 이동할 수 있습니다
      </div>
    </div>
  )
}
