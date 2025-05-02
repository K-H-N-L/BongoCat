<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'

import { Select, Slider, Switch } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

import ProList from '@/components/pro-list/index.vue'
import ProListItem from '@/components/pro-list-item/index.vue'
import { useCatStore } from '@/stores/cat'

const { t } = useI18n()
const catStore = useCatStore()

const modeList: SelectProps['options'] = [
  {
    label: t('cat.mode.standard'),
    value: 'standard',
  },
  {
    label: t('cat.mode.keyboard'),
    value: 'keyboard',
  },
]
</script>

<template>
  <ProList :title="t('cat.mode.title')">
    <ProListItem :title="t('cat.mode.select')">
      <Select
        v-model:value="catStore.mode"
        :options="modeList"
        :title="t('cat.mode.select')"
      />
    </ProListItem>
  </ProList>

  <ProList :title="t('cat.window.title')">
    <ProListItem
      :description="t('cat.window.penetrableDesc')"
      :title="t('cat.window.penetrable')"
    >
      <Switch v-model:checked="catStore.penetrable" />
    </ProListItem>

    <ProListItem
      :title="t('cat.window.opacity')"
      vertical
    >
      <Slider
        v-model:value="catStore.opacity"
        class="m-0!"
      />
    </ProListItem>

    <ProListItem :title="t('cat.window.mirror')">
      <Switch v-model:checked="catStore.mirrorMode" />
    </ProListItem>
  </ProList>
</template>
