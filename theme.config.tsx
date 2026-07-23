import './styles.css' 

const config: DocsThemeConfig = {
  logo: (
    <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
      PRACTICAL <span style={{ fontWeight: 400, opacity: 0.55 }}>Docs</span>
    </span>
  ),
  project: {
    link: 'https://github.com/practical-product'
  },
  docsRepositoryBase: 'https://github.com/practical-product/practical-product-docs/tree/main',
  primaryHue: 350,
  primarySaturation: 45,
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    backToTop: true
  },
  footer: {
    text: (
      <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
        © {new Date().getFullYear()} Practical Product — 패션 커머스 프로젝트
      </span>
    )
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Practical Product Docs" />
      <meta
        property="og:description"
        content="무신사 스타일에서 영감을 받은 패션 커머스 프로젝트, Practical Product 소개 문서"
      />
    </>
  )
}

export default config
