<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NaviLocation, } from '../types';

const {
  title = '領航位置列表',
  items = []
} = defineProps<{
  title?: string
  items?: NaviLocation[]
}>()

const searchQuery = ref('')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const rawItems = items ?? []

  if (!query) return rawItems

  return rawItems.filter(item => {
    const zhMatch = item.name?.toLowerCase().includes(query) ?? false;
    // const enMatch = item.nameEn?.toLowerCase().includes(query) ?? false
    // const jpMatch = item.nameJp?.toLowerCase().includes(query) ?? false
    const locationMatch = item.location?.toLowerCase().includes(query) ?? false;
    return zhMatch || locationMatch;
  })
})
</script>

<template>
  <div class="navi-location-container">
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋名稱或位置..."
        class="search-input"
      />
    </div>

    <!-- 表格主體 -->
    <div class="navi-table">
      <div class="table-header">
        <div class="col-name">領航員</div>
        <!-- <div class="col-jp">日文原名</div> -->
        <div class="col-location">出現位置</div>
      </div>

      <div class="table-body">
        <div v-for="(item, index) in filteredItems" :key="index" class="table-row">
          <div class="col-name name-cell">{{ item.name }}</div>
          <!-- <div class="col-jp jp-cell">{{ item.nameJp ?? '-' }}</div> -->
          <div class="col-location location-cell">{{ item.location }}</div>
        </div>

        <div v-if="filteredItems.length === 0" class="no-data">
          查無匹配數據「{{ searchQuery }}」
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navi-location-container { 
  margin: 1.5rem 0; 
  width: 100%;
}

.controls { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 1.5rem; 
}

.search-input { 
  padding: 10px 14px; 
  border: 1px solid var(--vp-c-divider); 
  border-radius: 6px; 
  background: var(--vp-c-bg-alt); 
  color: var(--vp-c-text-1); 
  width: 100%;
}

.navi-table {
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
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.col-name { 
  /* width: 180px; */
  width: 50%; 
  flex-shrink: 0;
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.col-jp { 
  width: 160px; 
  flex-shrink: 0;
  color: var(--vp-c-text-2);
}

.col-location { 
  flex: 1; /* 吃掉右邊所有剩餘空間 */
  word-break: break-word;
  color: var(--vp-c-text-1);
}

.no-data { 
  text-align: center; 
  color: var(--vp-c-text-2); 
  padding: 40px; 
  border-bottom: 1px solid var(--vp-c-divider); 
}
</style>