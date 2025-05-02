<script setup lang="ts">
import { Menu } from '@tauri-apps/api/menu'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { useDebounceFn, useEventListener } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDevice } from '@/composables/useDevice'
import { useModel } from '@/composables/useModel'
import { useSharedMenu } from '@/composables/useSharedMenu'
import { useCatStore } from '@/stores/cat'

const { t } = useI18n()
const appWindow = getCurrentWebviewWindow()
const { pressedMouses, mousePosition, pressedKeys } = useDevice()
const { backgroundImagePath, handleLoad, handleDestroy, handleResize, handleMouseDown, handleMouseMove, handleKeyDown } = useModel()
const catStore = useCatStore()
const { getSharedMenu } = useSharedMenu()

// 添加一个变量来存储当前的右键菜单
let contextMenu: any = null

// 添加一个函数来更新右键菜单
async function updateContextMenu() {
  // 如果已经创建了菜单，则先销毁它
  if (contextMenu) {
    // 注意：Tauri 的 Menu API 可能没有提供直接销毁菜单的方法
    // 这里我们只是将引用设为 null，下次右键点击时会创建新的菜单
    contextMenu = null
  }
}

// 添加监听 catStore 变化的代码，与 useTray.ts 中类似
const debouncedUpdateContextMenu = useDebounceFn(() => {
  updateContextMenu()
})

watch(() => catStore, () => {
  debouncedUpdateContextMenu()
}, { deep: true })

const resizing = ref(false)

onMounted(handleLoad)

onUnmounted(handleDestroy)

const handleDebounceResize = useDebounceFn(async () => {
  await handleResize()

  resizing.value = false
}, 100)

useEventListener('resize', () => {
  resizing.value = true

  handleDebounceResize()
})

watch(pressedMouses, handleMouseDown)

watch(mousePosition, handleMouseMove)

watch(pressedKeys, handleKeyDown)

watch(() => catStore.penetrable, (value) => {
  appWindow.setIgnoreCursorEvents(value)
}, { immediate: true })

function handleWindowDrag() {
  appWindow.startDragging()
}

async function handleContextmenu(event: MouseEvent) {
  event.preventDefault()

  // 每次右键点击时创建新的菜单
  contextMenu = await Menu.new({
    items: await getSharedMenu(),
  })

  contextMenu.popup()
}

function resolveImageURL(key: string) {
  return new URL(`../../assets/images/keys/${key}.png`, import.meta.url).href
}
</script>

<template>
  <div
    class="relative children:(absolute h-screen w-screen)"
    :class="[catStore.mirrorMode ? '-scale-x-100' : 'scale-x-100']"
    :style="{ opacity: catStore.opacity / 100 }"
    @contextmenu="handleContextmenu"
    @mousedown="handleWindowDrag"
  >
    <img :src="backgroundImagePath">

    <canvas id="live2dCanvas" />

    <img
      v-for="key in pressedKeys"
      :key="key"
      :src="resolveImageURL(key)"
    >

    <div
      v-show="resizing"
      class="flex items-center justify-center bg-black"
    >
      <span class="text-center text-5xl text-white">
        {{ t('cat.redrawing') }}
      </span>
    </div>
  </div>
</template>
