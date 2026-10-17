<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NaviLocation } from '../types';

const {
  edition = '',
  title = '領航員位置列表',
  items = []
} = defineProps<{
  edition?: string
  title?: string
  items?: NaviLocation[]
}>()

const searchQuery = ref('')
const selectedVersion = ref('全部')

const versions = computed(() => {
  const rawItems = items ?? []
  const set = new Set(rawItems.map(item => item.gameVersion).filter(Boolean))
  return ['全部', ...Array.from(set)]
})

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const rawItems = items ?? []

  return rawItems.filter(item => {
    const zhMatch = item.name?.toLowerCase().includes(query) ?? false;
    const versionMatch = item.gameVersion?.toLowerCase().includes(query) ?? false;
    const locationMatch = item.locations?.some(loc => 
      loc.location.toLowerCase().includes(query) || 
      loc.versionType.toLowerCase().includes(query)
    ) ?? false;
    
    const matchesQuery = !query || zhMatch || locationMatch || versionMatch;

    // 2. 下拉選單版本過濾比對
    const matchesVersion = selectedVersion.value === '全部' || item.gameVersion === selectedVersion.value;

    return matchesQuery && matchesVersion;
  })
})

const getVersionClass = (version?: string) => {
  if (edition === 'exe4') {
    if (version === '藍月亮') return 'version-bluemoon'
    if (version === '紅太陽') return 'version-redsun'
  }
  return 'version-common'
}

const getBadgeClass = (type: string) => {
  switch (type) {
    case 'V1': return 'tag-v1'
    case 'V2': return 'tag-v2'
    case 'V3': return 'tag-v3'
    case 'EX': return 'tag-ex'
    case 'SP': return 'tag-sp'
    case 'FZ': return 'tag-fz'
    case 'DS': return 'tag-ds'
    case 'XX': return 'tag-xx'
    default: return 'tag-common'
  }
}
</script>

<template>
  <div class="navi-location-container">
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋領航員名稱、V2/V3、出現位置..."
        class="search-input"
      />
      
      <select v-if="!['exe1', 'exe2'].includes(edition)" v-model="selectedVersion" class="version-select">
        <option v-for="ver in versions" :key="ver" :value="ver">
          {{ ver === '全部' ? '全部版本' : ver }}
        </option>
      </select>
    </div>

    <!-- 現代化卡片網格 (Grid) -->
    <div class="navi-grid">
      <div 
        v-for="(item, index) in filteredItems" 
        :key="index" 
        class="navi-card"
        :class="getVersionClass(item.gameVersion)"
      >
        <div v-if="item.gameVersion" class="card-header-badges">
          <span class="navi-badge" :class="getVersionClass(item.gameVersion)">
            {{ item.gameVersion }}
          </span>
        </div>
        
        <div class="card-content">
          <h3 class="navi-name">{{ item.name }}</h3>
          
          <div class="location-list">
            <div 
              v-for="(loc, locIndex) in item.locations" 
              :key="locIndex" 
              class="navi-location-row"
            >
              <div class="location-meta">
                <span class="version-tag" :class="getBadgeClass(loc.versionType)">
                  {{ loc.versionType }}
                </span>
                <span class="status-badge" :class="loc.isRandom ? 'is-random' : 'is-fixed'">
                  {{ loc.isRandom ? '隨機' : '固定' }}
                </span>
              </div>
              <div class="navi-location location-text">
                <svg class="location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>                
                <span class="value">{{ loc.location }}</span>
                <span v-if="loc.note" class="note">({{ loc.note }})</span>
              </div>
            </div>
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

.search-input, .version-select { 
  padding: 10px 14px; 
  border: 1px solid var(--vp-c-divider); 
  border-radius: 8px; 
  background: var(--vp-c-bg-alt); 
  color: var(--vp-c-text-1); 
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input { 
  flex: 1; 
}

.version-select {
  min-width: 130px;
  cursor: pointer;
}

.search-input:focus, .version-select:focus {
  border-color: var(--vp-c-brand);
  outline: none;
}

.navi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  width: 100%;
}

.navi-card {
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  background: var(--vp-c-bg-alt);
}

.navi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.navi-card.version-bluemoon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, var(--vp-c-bg-alt) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  border-left: 4px solid #3b82f6;
}
.navi-badge.version-bluemoon {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

.navi-card.version-redsun {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, var(--vp-c-bg-alt) 100%);
  border-color: rgba(239, 68, 68, 0.3);
  border-left: 4px solid #ef4444;
}
.navi-badge.version-redsun {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

.navi-card.version-common .card-header-badges .navi-badge.version-common {
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.25);
  font-weight: 600;
}

.dark .navi-card.version-common .card-header-badges .navi-badge.version-common {
  background: rgba(129, 140, 248, 0.18);
  color: #a5b4fc;
  border: 1px solid rgba(129, 140, 248, 0.3);
}

.card-header-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.navi-name {
  font-size: 1.15rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  margin: 0;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 8px;
}

.navi-location-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.9rem;
}

.location-meta {
  display: flex;
  gap: 6px;
  align-items: center;
}

.version-tag {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 4px;
}
.tag-v1 { background: rgba(6, 182, 212, 0.15); color: #0891b2; }
.tag-v2 { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.tag-v3 { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.tag-ex { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.tag-sp { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.tag-fz { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.tag-ds { background: var(--vp-c-default-3); color: var(--vp-c-text-1); }

.tag-xx {
  background: rgba(225, 29, 72, 0.18);
  color: #ff0000;
  border: 1px solid rgba(225, 0, 0, 0.35);
  font-weight: 800;
}
.dark .tag-xx {
  background: rgba(255, 63, 94, 0.22);
  color: #ff0000;
  border-color: rgba(255, 0, 0, 0.45);
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}

.is-fixed { 
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.is-random { 
  background: rgba(236, 72, 153, 0.12); 
  color: #db2777;
  border: 1px solid rgba(236, 72, 153, 0.25);
}

.navi-location .value {
  color: var(--vp-c-text-2);
  word-break: break-word;
}

.note {
  font-size: 0.7em;
  color: var(--vp-c-text-3);
  margin-left: 4px;
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

/* Location 區塊容器 */
.location-text {
  display: flex;
  align-items: center;
  gap: 5px; /* Icon 與文字之間的間距 */
  margin-top: 4px;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.location-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0; /* 防止文字過長時 Icon 被擠壓變形 */
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

.navi-card:hover .location-icon {
  color: var(--vp-c-brand-1);
}
</style>