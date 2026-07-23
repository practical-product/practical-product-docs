import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  codeHighlight: false
})

export default withNextra({
  reactStrictMode: true
})
