import { defineClientConfig } from 'vuepress/client'
import './styles/custom.css'
import HomeIntro from './components/HomeIntro.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('HomeIntro', HomeIntro)
    import('./components/Redirect.vue').then((module) => {
      app.component('Redirect', module.default)
    })
    import('./components/QQGroupJoin.vue').then((module) => {
      app.component('QQGroupJoin', module.default)
    })
  },
})
