<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NaviLocation } from '../types';

const {
  title = '領航員位置列表',
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
    const locationMatch = item.location?.toLowerCase().includes(query) ?? false;
    const versionMatch = item.gameVersion?.toLowerCase().includes(query) ?? false;
    return zhMatch || locationMatch || versionMatch;
  })
})

const getVersionClass = (version?: string) => {
  if (version === '藍月亮') return 'version-bluemoon'
  if (version === '紅太陽') return 'version-redsun'
  return 'version-common'
}
</script>

<template>
  <div class="navi-location-container">
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋領航員名稱、出現位置或版本..."
        class="search-input"
      />
    </div>

    <!-- 現代化卡片網格 (Grid) -->
    <div class="navi-grid">
      <div 
        v-for="(item, index) in filteredItems" 
        :key="index" 
        class="navi-card"
        :class="getVersionClass(item.gameVersion)"
      >
        <div class="card-icon-area">
          <span class="navi-badge" :class="getVersionClass(item.gameVersion)">
            {{ item.gameVersion }}
          </span>
        </div>
        <div class="card-content">
          <h3 class="navi-name">{{ item.name }}</h3>
          <div class="navi-location">
            <span class="label">出現位置：</span>
            <span class="value">{{ item.location }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="no-data">
        查無匹配數據「{{ searchQuery }}」
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
  padding: 12px 16px; 
  border: 1px solid var(--vp-c-divider); 
  border-radius: 8px; 
  background: var(--vp-c-bg-alt); 
  color: var(--vp-c-text-1); 
  width: 100%;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--vp-c-brand);
  outline: none;
}

.navi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
}

/* 基礎卡片樣式 */
.navi-card {
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.navi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 藍月亮版本風格：半透明冰藍色背景 + 藍色左邊框 */
.navi-card.version-bluemoon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, var(--vp-c-bg-alt) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  border-left: 4px solid #3b82f6;
}
.navi-badge.version-bluemoon {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

/* 紅太陽版本風格：半透明暖橘紅背景 + 橘紅左邊框 */
.navi-card.version-redsun {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, var(--vp-c-bg-alt) 100%);
  border-color: rgba(239, 68, 68, 0.3);
  border-left: 4px solid #ef4444;
}
.navi-badge.version-redsun {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

/* 共通版本風格：標準中性背景 */
.navi-card.version-common {
  background: var(--vp-c-bg-alt);
  border-left: 4px solid var(--vp-c-divider);
}
.navi-badge.version-common {
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.navi-name {
  font-size: 1.15rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  margin: 0;
}

.navi-location {
  font-size: 0.95rem;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.navi-location .label {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  white-space: nowrap;
}

.navi-location .value {
  color: var(--vp-c-text-2);
  word-break: break-word;
}

.navi-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  width: fit-content;
}

.no-data { 
  grid-column: 1 / -1;
  text-align: center; 
  color: var(--vp-c-text-2); 
  padding: 40px; 
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}
</style>