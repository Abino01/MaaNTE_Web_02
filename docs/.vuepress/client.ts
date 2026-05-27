import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router }) {
    import('./components/Redirect.vue').then((module) => {
      app.component('Redirect', module.default)
    })

    // Fix breadcrumb RDFa structured data
    if (router) {
      router.afterEach(() => {
        fixBreadcrumbRDFa()
      })
    }

    // Also run on initial load
    if (typeof window !== 'undefined') {
      window.addEventListener('load', fixBreadcrumbRDFa)
    }
  },
})

function fixBreadcrumbRDFa() {
  if (typeof document === 'undefined') return

  const breadcrumbItems = document.querySelectorAll('.vp-breadcrumb li[typeof="ListItem"]')

  breadcrumbItems.forEach((li, index) => {
    const webPageElement = li.querySelector('[typeof="WebPage"]')
    if (webPageElement && !webPageElement.hasAttribute('resource')) {
      const position = index + 1
      let url = 'https://maa-nte.github.io'

      if (position === 1) {
        url += '/'
      } else {
        const currentPath = window.location.pathname
        const pathSegments = currentPath.split('/').filter(Boolean)

        if (pathSegments.length >= position - 1) {
          url += '/' + pathSegments.slice(0, position - 1).join('/') + '/'
        }
      }

      webPageElement.setAttribute('resource', url)
    }
  })
}
