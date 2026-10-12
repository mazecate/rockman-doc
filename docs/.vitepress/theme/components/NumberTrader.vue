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
    <!-- <h2>{{ title }}</h2> -->
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

    <div class="trader-table">
      <div class="table-header">
        <div class="col-code">8位數密碼</div>
        <div class="col-name">獲得物品</div>
        <div class="col-cat">分類</div>
      </div>
      
      <div class="table-body">
        <div v-for="item in filteredItems" :key="item.number" class="table-row">
          <div class="col-code code-cell"><code>{{ item.number }}</code></div>
          <div v-if="item.category !== '程式部件'" class="col-name name-cell">{{ item.nameZh }} {{ item.other }}</div>
          <div v-else class="col-name name-cell">{{ item.nameZh }} ({{ item.other }})</div>
          <div class="col-cat cat-cell"><span class="tag">{{ item.category }}</span></div>
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

.trader-table {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.table-header, .table-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.table-header > div, .table-row > div {
  padding: 16px 20px;
}

.table-header {
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 1px;
  background: var(--vp-c-bg-alt);
  border-bottom: 2px solid var(--vp-c-divider);
}

.table-row {
  border-bottom: 1px solid var(--vp-c-divider);
}

.col-code { 
  width: 180px; 
  flex-shrink: 0;
} 

.col-cat { 
  width: 140px; 
  flex-shrink: 0;
}

.col-name { 
  flex: 1; /* 強制吃掉右邊所有剩下的空間，有多少拿多少 */
  word-break: break-word;
}

.code-cell { font-weight: bold; color: var(--vp-c-brand-1); }
.tag { padding: 4px 10px; border-radius: 6px; background: var(--vp-c-bg-soft); font-size: 0.85em; border: 1px solid var(--vp-c-divider); }
.no-data { text-align: center; color: var(--vp-c-text-2); padding: 40px; border-bottom: 1px solid var(--vp-c-divider); }
</style>
