<script setup lang="ts">
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'
import { Switch } from 'ant-design-vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

import ProList from '@/components/pro-list/index.vue'
import ProListItem from '@/components/pro-list-item/index.vue'
import { useGeneralStore } from '@/stores/general'

const { t } = useI18n()
const generalStore = useGeneralStore()

watch(() => generalStore.autostart, async (value) => {
  const enabled = await isEnabled()

  if (value && !enabled) {
    return enable()
  }

  if (!value && enabled) {
    disable()
  }
})
</script>

<template>
  <ProList :title="t('general.app.settings')">
    <ProListItem :title="t('general.app.autostart')">
      <Switch v-model:checked="generalStore.autostart" />
    </ProListItem>
  </ProList>

  <ProList :title="t('general.update.settings')">
    <ProListItem :title="t('general.update.autoCheck')">
      <Switch v-model:checked="generalStore.autoCheckUpdate" />
    </ProListItem>
  </ProList>
</template>
