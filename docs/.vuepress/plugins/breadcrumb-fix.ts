import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export default () => ({
  name: 'breadcrumb-seo-fix',
  extendsPage: (page: any) => {
    const breadcrumbData = generateBreadcrumbStructuredData(page)
    if (breadcrumbData) {
      page.frontmatter.head = page.frontmatter.head || []
      page.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify(breadcrumbData),
      ])
    }
  },
  onGenerated: async (app: any) => {
    const destDir = app.dir.dest()
    for (const page of app.pages) {
      let filePath = path.join(destDir, decodeURIComponent(page.path))
      if (page.path.endsWith('/')) {
        filePath += 'index.html'
      }
      try {
        const html = await readFile(filePath, 'utf-8')
        const modifiedHtml = fixBreadcrumbRDFaInHTML(html, page.path)
        await writeFile(filePath, modifiedHtml)
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error)
      }
    }
    // Also fix Article structured data for the home page
    const homeFilePath = path.join(destDir, 'index.html')
    try {
      const html = await readFile(homeFilePath, 'utf-8')
      const modifiedHtml = fixArticleStructuredDataInHTML(html)
      await writeFile(homeFilePath, modifiedHtml)
    } catch (error) {
      console.error(`Error processing home page ${homeFilePath}:`, error)
    }
  },
})

function generateBreadcrumbStructuredData(page: any) {
  const pagePath = page.path
  if (pagePath === '/' || pagePath === '/index.html') return null

  const segments = pagePath.split('/').filter(Boolean)
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: '首页',
      item: {
        '@id': 'https://maa-nte.github.io/',
      },
    },
  ]

  let currentPath = ''
  segments.forEach((segment: string, index: number) => {
    currentPath += '/' + segment
    const position = index + 2
    const name = page.title || segment.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    itemListElement.push({
      '@type': 'ListItem',
      position,
      name,
      item: {
        '@id': `https://maa-nte.github.io${currentPath}/`,
      },
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

function fixBreadcrumbRDFaInHTML(html: string, pagePath: string) {
  if (pagePath === '/' || pagePath === '/index.html') return html

  let modifiedHtml = html.replace('<body>', '<body data-transformed="true">')

  const breadcrumbRegex = /<li[^>]*property="itemListElement"[^>]*typeof="ListItem"[^>]*>[\s\S]*?<span[^>]*property="item"[^>]*typeof="WebPage"[^>]*>(.*?)<\/span>[\s\S]*?<\/li>/g

  const segments = pagePath.split('/').filter(Boolean)
  let position = 1
  let match
  while ((match = breadcrumbRegex.exec(html)) !== null) {
    position++
    if (position <= segments.length + 1) {
      let url = 'https://maa-nte.github.io'
      if (position === 1) {
        url += '/'
      } else {
        const pathSegments = segments.slice(0, position - 1)
        url += '/' + pathSegments.join('/') + '/'
      }

      const originalSpan = match[0]
      const spanWithResource = originalSpan.replace(
        /(<span[^>]*property="item"[^>]*typeof="WebPage"[^>]*)/,
        `$1 resource="${url}"`,
      )

      modifiedHtml = modifiedHtml.replace(originalSpan, spanWithResource)
    }
  }

  modifiedHtml = fixArticleStructuredDataInHTML(modifiedHtml)

  return modifiedHtml
}

function fixArticleStructuredDataInHTML(html: string) {
  const articleRegex = /<script type="application\/ld\+json">(\{[^}]*"@type":"Article"[^}]*\})<\/script>/
  const match = html.match(articleRegex)
  if (match) {
    try {
      const articleData = JSON.parse(match[1])
      if (!articleData.image || articleData.image.length === 0 || articleData.image.every((img: string) => !img)) {
        articleData.image = ['https://maa-nte.github.io/images/logo_32x32.png']
      }
      if (!articleData.author || articleData.author.length === 0) {
        articleData.author = [
          { '@type': 'Organization', 'name': 'MaaNTE Team', 'url': 'https://maa-nte.github.io' },
        ]
      }
      const updatedScript = `<script type="application/ld+json">${JSON.stringify(articleData)}</script>`
      return html.replace(match[0], updatedScript)
    } catch (error) {
      console.error('Error parsing Article JSON-LD:', error)
    }
  }
  return html
}
