<template>
  <div class="reference-section" v-if="selectedReferences.length > 0">
    <h2 id="ref" tabindex="-1">
      <a class="header-anchor" id="ref" aria-hidden="true"></a>
      參考資料來源（部分文本翻譯參考自中文合集版遊戲，並結合個人遊玩紀錄與修改調整）：
    </h2>

    <ol>
      <li v-for="(item, index) in selectedReferences" :key="index">
        <a :href="item.url" target="_blank" rel="noopener noreferrer">
          {{ item.title }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 傳入要顯示的 key 陣列，例如：['a', 'abc']
const {
  items = [],
  description = ''
} = defineProps<{
  items?: string[]
  description?: string
}>()

const DATABASE: Record<string, { title: string; url: string }> = {
  wily: {
    title: 'wily',
    url: 'http://wily.xrea.jp/rockman/exe/exe1/story.htm'
  },
  archive: {
    title: 'archive.org',
    url: 'https://archive.org/details/qw-GBA-rmexe'
  },
  game8: {
    title: 'game8',
    url: 'https://game8.jp/rockman-exe-4'
  },
  wareware: {
    title: 'warewareguide',
    url: 'https://warewareguide.com/rockmanexe4/battlerspt/'
  }
}

const selectedReferences = computed(() => {
  return (items)
    .map(key => DATABASE[key])
    .filter(Boolean)
})
</script>

<style scoped>
.reference-section {
  margin-top: 2.5rem;
}

.ref-subtitle {
  font-size: 0.85em;
  font-weight: normal;
  color: var(--vp-c-text-2);
}
</style>