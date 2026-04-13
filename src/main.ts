import { createApp } from 'vue'
import UnnovateFormBuilder from '@unnovate-brains/form-builder'
import '@unnovate-brains/form-builder/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(UnnovateFormBuilder)
app.use(router)

app.mount('#app')
