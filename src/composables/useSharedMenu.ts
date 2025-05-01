import type { CatMode } from '@/stores/cat'

import { CheckMenuItem, MenuItem, PredefinedMenuItem, Submenu } from '@tauri-apps/api/menu'
import { useI18n } from 'vue-i18n'

import { hideWindow, showWindow } from '@/plugins/window'
import { useCatStore } from '@/stores/cat'
import { isMac } from '@/utils/platform'

interface ModeOption {
  label: string
  value: CatMode
}

interface LanguageOption {
  label: string
  value: string
}

export function useSharedMenu() {
  const { t, locale } = useI18n()

  const catStore = useCatStore()

  const modeOptions: ModeOption[] = [
    { label: t('cat.mode.standard'), value: 'standard' },
    { label: t('cat.mode.keyboard'), value: 'keyboard' },
  ]

  const languageOptions: LanguageOption[] = [
    { label: '中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ]

  const getOpacityMenuItems = async () => {
    const options = [25, 50, 75, 100]

    const items = options.map((item) => {
      return CheckMenuItem.new({
        text: `${item}%`,
        checked: catStore.opacity === item,
        action: () => {
          catStore.opacity = item
        },
      })
    })

    if (!options.includes(catStore.opacity)) {
      items.unshift(CheckMenuItem.new({
        text: `${catStore.opacity}%`,
        checked: true,
        enabled: false,
      }))
    }

    return Promise.all(items)
  }

  const getSharedMenu = async () => {
    return await Promise.all([
      MenuItem.new({
        text: t('cat.settings'),
        accelerator: isMac ? 'Cmd+,' : '',
        action: () => showWindow('preference'),
      }),
      MenuItem.new({
        text: catStore.visible ? t('cat.hide') : t('cat.show'),
        action: () => {
          if (catStore.visible) {
            hideWindow('main')
          } else {
            showWindow('main')
          }

          catStore.visible = !catStore.visible
        },
      }),
      PredefinedMenuItem.new({ item: 'Separator' }),
      Submenu.new({
        text: t('cat.mode.title'),
        items: await Promise.all(
          modeOptions.map((item) => {
            return CheckMenuItem.new({
              text: item.label,
              checked: catStore.mode === item.value,
              action: () => {
                catStore.mode = item.value
              },
            })
          }),
        ),
      }),
      CheckMenuItem.new({
        text: t('cat.window.penetrable'),
        checked: catStore.penetrable,
        action: () => {
          catStore.penetrable = !catStore.penetrable
        },
      }),
      Submenu.new({
        text: t('cat.window.opacity'),
        items: await getOpacityMenuItems(),
      }),
      CheckMenuItem.new({
        text: t('cat.window.mirror'),
        checked: catStore.mirrorMode,
        action: () => {
          catStore.mirrorMode = !catStore.mirrorMode
        },
      }),
      PredefinedMenuItem.new({ item: 'Separator' }),
      Submenu.new({
        text: '语言 / Language',
        items: await Promise.all(
          languageOptions.map((item) => {
            return CheckMenuItem.new({
              text: item.label,
              checked: catStore.language === item.value,
              action: () => {
                catStore.language = item.value
                locale.value = item.value
              },
            })
          }),
        ),
      }),
    ])
  }

  return {
    getSharedMenu,
  }
}
