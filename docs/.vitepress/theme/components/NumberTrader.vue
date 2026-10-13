<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TradeItem, } from '../types';

const {
  title = '搜尋',
  items = []
} = defineProps<{
  title?: string
  items?: TradeItem[]
}>();

const searchQuery = ref('')
const selectedCategory = ref('全部')

const categories = computed(() => {  
  const set = new Set(items.map(item => item.category))
  return ['全部', ...Array.from(set)]
});

const filteredItems = computed(() => {
  return items.filter(item => {
    const matchesCode = item.number.includes(searchQuery.value) || item.nameZh.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === '全部' || item.category === selectedCategory.value
    return matchesCode && matchesCategory
  })
});
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

    <div class="trader-grid-container">
      <div class="trader-grid">
        <div v-for="item in filteredItems" :key="item.number" class="trade-card">
          <!-- 上方：物品名稱與分類標籤 -->
          <div class="card-header">
            <div v-if="item.category !== '程式部件'" class="card-name">{{ item.nameZh }} {{ item.other }}</div>
            <div v-else class="card-name">{{ item.nameZh }} ({{ item.other }})</div>
            <span class="tag">{{ item.category }}</span>
          </div>

          <!-- 下方：8位數密碼區塊 -->
          <div class="card-code">
            <span class="code-label">密碼</span>
            <code class="code-value">{{ item.number }}</code>
          </div>
        </div>
        
        <div v-if="filteredItems.length === 0" class="no-data">
          查無匹配數據
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trader-container { 
  margin: 1.5rem 0; 
  width: 100%;
}
.controls { display: flex; gap: 10px; margin-bottom: 1.5rem; }
.search-input, .category-select { padding: 10px 14px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-alt); color: var(--vp-c-text-1); }
.search-input { flex: 1; }

/* 網格佈局：電腦版自動排成多欄，充分利用空間 */
.trader-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}

/* 單張卡片設計 */
.trade-card {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
}

.trade-card:hover {
  border-color: var(--vp-c-brand-1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.card-name {
  font-size: 1.05rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  word-break: break-word;
}

.tag { 
  padding: 2px 8px; 
  border-radius: 4px; 
  background: var(--vp-c-bg-soft); 
  font-size: 0.8em; 
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
  color: var(--vp-c-text-2);
}

.card-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px dashed var(--vp-c-divider);
}

.code-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.code-value {
  font-weight: bold;
  color: var(--vp-c-brand-1);
  font-size: 1.05rem;
  letter-spacing: 0.5px;
}

.no-data { 
  grid-column: 1 / -1;
  text-align: center; 
  color: var(--vp-c-text-2); 
  padding: 40px; 
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
</style>