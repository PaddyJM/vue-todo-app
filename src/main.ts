import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({ components, directives })

app.use(pinia)
app.use(router)
app.use(
  createAuth0({
    domain: 'dev-5akspl1d.us.auth0.com',
    clientId: `${import.meta.env.VITE_AUTH_0_CLIENT_ID}`,
    authorizationParams: {
      redirect_uri: `${import.meta.env.VITE_AUTH_0_REDIRECT_URI}`
    }
  })
)
app.use(vuetify)

app.mount('#app')
