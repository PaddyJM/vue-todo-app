import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

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

app.mount('#app')
