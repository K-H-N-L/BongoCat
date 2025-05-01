import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CatMode = 'standard' | 'keyboard'

export const useCatStore = defineStore('cat', () => {
  const mode = ref<CatMode>('standard')
  const visible = ref(true)
  const penetrable = ref(false)
  const opacity = ref(100)
  const mirrorMode = ref(false)
  const language = ref('zh')

  return {
    mode,
    visible,
    penetrable,
    opacity,
    mirrorMode,
    language,
  }
})
