import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App)

app.use(router)
app.use(
  createAuth0({
    domain: "dev-5akspl1d.us.auth0.com",
    clientId: "pXQf8c3rDCqi7feJsn1MrXmb59i3HnB9",
    authorizationParams: {
      redirect_uri: 'http://localhost:5173'
    }
  })
);

app.mount('#app')
