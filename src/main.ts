// import './assets/main.css';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createApp } from 'vue';
import App from './App.vue';
import './tailwind.css';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'en',
  messages,
});

createApp(App).use(i18n).mount('#app');
