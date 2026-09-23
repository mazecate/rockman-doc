<script setup lang="ts">
import { ref, computed } from 'vue'

interface TradeItem {
  code: string
  reward: string
  category: string
}

const props = defineProps<{
  items: TradeItem[]
}>()

const searchQuery = ref('')
const selectedCategory = ref('ALL')

const categories = computed(() => {
  const set = new Set(props.items.map(item => item.category))
  return ['ALL', ...Array.from(set)]
})

const filteredItems = computed(() => {
  return props.items.filter(item => {
    const matchesCode = item.code.includes(searchQuery.value) || item.reward.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'ALL' || item.category === selectedCategory.value
    return matchesCode && matchesCategory
  })
})
</script>

<template>
  <div class="trader-container">
    <div class="controls">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="搜尋密碼或獎勵名稱..." 
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-select">
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <table class="trader-table">
      <thead>
        <tr>
          <th>8位數密碼</th>
          <th>獲得獎勵 / 晶片</th>
          <th>分類</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.code">
          <td class="code-cell"><code>{{ item.code }}</code></td>
          <td>{{ item.reward }}</td>
          <td><span class="tag">{{ item.category }}</span></td>
        </tr>
        <tr v-if="filteredItems.length === 0">
          <td colspan="3" class="no-data">查無匹配數據</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.trader-container { margin: 1rem 0; }
.controls { display: flex; gap: 10px; margin-bottom: 1rem; }
.search-input, .category-select { padding: 8px 12px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-alt); color: var(--vp-c-text-1); }
.search-input { flex: 1; }
.trader-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.trader-table th, .trader-table td { padding: 10px; border: 1px solid var(--vp-c-divider); text-align: left; }
.code-cell { font-weight: bold; color: var(--vp-c-brand-1); }
.tag { padding: 2px 8px; border-radius: 4px; background: var(--vp-c-bg-soft); font-size: 0.85em; }
.no-data { text-align: center; color: var(--vp-c-text-2); }
</style>