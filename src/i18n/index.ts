import { createI18n } from 'vue-i18n'

import en from './locales/en'
import zh from './locales/zh'

const messages = {
  en,
  zh,
}

const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages,
})

export default i18n
