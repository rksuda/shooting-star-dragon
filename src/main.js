import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'

const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'en',
});

const app = createApp(App);

app.use(i18n);
app.mount('#app');
