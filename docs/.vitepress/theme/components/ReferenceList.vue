<template>
  <div class="reference-section" v-if="selectedReferences.length > 0">
    <h2 id="ref" tabindex="-1">
      <a class="header-anchor" id="ref" aria-hidden="true"></a>
      參考資料來源：
    </h2>
    <h5>「部分內容參考自中文合集版遊戲內文，並結合個人遊玩紀錄與實機截圖修改調整。」</h5>
    <ol>
      <li v-for="(item, index) in selectedReferences" :key="index">
        <a :href="item.url" class="ref-link" target="_blank" rel="noopener noreferrer">
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
    url: 'http://wily.xrea.jp/rockman/exe'
  },
  archive: {
    title: 'archive.org',
    url: 'https://archive.org/details/qw-GBA-rmexe'
  },
  game8: {
    title: 'game8',
    url: 'https://game8.jp/rockman-exe-4'
  },
  warewareguide: {
    title: 'warewareguide',
    url: 'https://warewareguide.com/rockmanexe4/battlerspt/'
  },
  prism: {
    title: 'prism',
    url: 'http://prism.s27.xrea.com/exe1/'
  },
  fandom: {
    title: 'fandom',
    url: 'https://megaman.fandom.com/wiki/List_of_Mega_Man_Battle_Network_2_Battle_Chips'
  },
  fandom_mmbn3: {
    title: 'fandom_mmbn3',
    url: 'https://megaman.fandom.com/wiki/List_of_Mega_Man_Battle_Network_3_Battle_Chips'
  },
  fandom_mmbn3_lotto: {
    title: 'fandom_mmbn3_lotto',
    url: 'https://megaman.fandom.com/wiki/Lotto_Number'
  },
  megaQuint: {
    title: 'MegaQuint',
    url: 'https://www.youtube.com/watch?v=l-GwZlGGQBU'
  },
  appmedia: {
    title: 'Appmedia',
    url: 'https://appmedia.jp/rockman_exe3'
  },
  kamigame: {
    title: 'Kamigame',
    url: 'https://kamigame.jp/rockmanexe3/index.html'
  },
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

.ref-link {
  text-decoration: none;
}
</style>