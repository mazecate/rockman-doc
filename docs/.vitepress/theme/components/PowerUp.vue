<script setup lang="ts">
import { ref, computed } from 'vue'
// import ImagePopUp from './ImagePopUp.vue' // 引入你的 ImagePopUp 元件[cite: 1]

export interface PowerUpItem {
  type: string       // 'hp' | '子彈強化' | 'reg' | 'sub' | 'expand' | 'armor' 等
  name: string       // 道具名稱
  method: string     // 入手方法 / 購買說明
  location: string   // 地點
  price?: string     // 價格 (選填)
  value?: number     // 數值增量（例如常駐 UP 的 +1、+2 等）
  locationImage?: string | null // 地圖截圖路徑
}

const props = defineProps<{
  items: PowerUpItem[]
}>()

const searchQuery = ref('')
const selectedType = ref('all')

// 擴充後的完整分類設定（涵蓋 HP、子彈強化、常駐UP、副記憶體、擴張記憶體、裝甲等）
const categories: Record<string, { label: string; icon: string }> = {
  hp: { label: 'HP記憶體', icon: '❤️' },
  buster: { label: '子彈強化', icon: '⚡' },
  reg: { label: '常規強化', icon: '📌' },
  sub: { label: '副記憶體', icon: '🔋' },
  expand: { label: '擴張記憶體', icon: '📦' },
  armor: { label: '裝甲部件', icon: '🛡️' }
}

// 動態抓取現有資料中出現過的分類
const availableTypes = computed(() => {
  return Array.from(new Set(props.items.map(i => i.type)))
})

// 計算全體項目總數量
const totalCount = computed(() => props.items.length)

// 計算每個分類的各自總數量
const typeCounts = computed(() => {
  const counts: Record<string, number> = {}
  props.items.forEach(item => {
    counts[item.type] = (counts[item.type] || 0) + 1
  })
  return counts
})

// 過濾與搜尋邏輯
const filteredItems = computed(() => {
  return props.items.filter(item => {
    const matchesType = selectedType.value === 'all' || item.type === selectedType.value
    
    const query = searchQuery.value.toLowerCase().trim()
    const matchesQuery = 
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.method.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      (item.price && item.price.toLowerCase().includes(query))

    return matchesType && matchesQuery
  })
})

// 計算所有商店購入項目的金額總和
const totalShopPrice = computed(() => {
  const sum = props.items
    .filter(item => item.price)
    .reduce((total, item) => {
      const val = parseInt(item.price!.replace(/[^0-9]/g, ''), 10) || 0
      return total + val
    }, 0)
  return sum.toLocaleString() + ' Z'
})
</script>

<template>
  <div class="powerup-guide-container">
    <!-- 1. 搜尋欄與分類 Filter Tabs -->
    <div class="controls-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜尋名稱、地點、入手方法或價格..." 
          class="search-input"
        />
      </div>

      <div class="category-tabs">
        <!-- 全部按鈕 (帶有總數量) -->
        <button 
          :class="['tab-btn', { active: selectedType === 'all' }]"
          @click="selectedType = 'all'"
        >
          🌐 全部顯示
          <span class="count-pill">{{ totalCount }}</span>
        </button>

        <!-- 動態各分類按鈕 (帶有各自數量) -->
        <button 
          v-for="t in availableTypes" 
          :key="t"
          :class="['tab-btn', { active: selectedType === t }]"
          @click="selectedType = t"
        >
          {{ categories[t]?.icon || '📦' }} {{ categories[t]?.label || t.toUpperCase() }}
          <span class="count-pill">{{ typeCounts[t] || 0 }}</span>
        </button>
      </div>
    </div>

    <!-- 2. 商店採購總花費提示卡 (如果有商店項目才顯示) -->
    <div v-if="totalShopPrice !== '0 Z'" class="shop-summary-card">
      <div class="summary-info">
        <span class="shop-icon">🛒</span>
        <div>
          <strong class="title">商店全買齊總花費：</strong>
          <span class="sub-text">包含所有商店購入之強化部件與記憶體</span>
        </div>
      </div>
      <div class="total-badge">{{ totalShopPrice }}</div>
    </div>

    <!-- 3. RWD 響應式卡片列表 -->
    <div v-if="filteredItems.length > 0" class="cards-grid">
      <div v-for="(item, idx) in filteredItems" :key="idx" class="power-card">
        <div class="card-header">
          <span :class="['type-badge', `badge-${item.type}`]">
            {{ categories[item.type]?.label || item.type.toUpperCase() }}
          </span>
          <h3 class="item-name">
            <!-- {{ item.name }} -->
            <span v-if="item.type === 'armor'">{{ item.name }}</span>
            <span v-if="item.value" class="val-badge">+{{ item.value }}{{ item.type === 'reg' ? ' MB' : '' }}</span>
          </h3>

          <span v-if="item.price" class="price-badge">💰 {{ item.price }}</span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">入手方式</span>
            <span class="value">{{ item.method }}</span>
          </div>

          <div class="info-row">
            <span class="label">獲得地點</span>
            <span class="value">
              <!-- ImagePopUp 元件：依據內部 hasValidImage 自動切換 pointer 與彈窗 -->
              <ImagePopUp :src="item.locationImage" :alt="item.location">
                <span class="loc-link">📍 {{ item.location }}</span>
              </ImagePopUp>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 無資料提示 -->
    <div v-else class="empty-box">
      沒有找到符合條件的強化部件資料
    </div>
  </div>
</template>

<style scoped>
.powerup-guide-container {
  margin: 1.5rem 0;
  width: 100%;
}

/* 控制列區域 */
.controls-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.2rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.search-icon {
  position: absolute;
  left: 12px;
  opacity: 0.6;
}

/* 分類標籤頁與數量徽章 */
.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.count-pill {
  font-size: 0.75rem;
  padding: 1px 6px;
  border-radius: 10px;
  background: var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.tab-btn.active .count-pill {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* 商店總金額提示卡 */
.shop-summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid #eab308;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 1.5rem;
  gap: 12px;
  flex-wrap: wrap;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-icon {
  font-size: 1.5rem;
}

.summary-info .title {
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.summary-info .sub-text {
  display: block;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.total-badge {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ca8a04;
  background: rgba(234, 179, 8, 0.15);
  padding: 4px 12px;
  border-radius: 6px;
}

/* RWD 卡片網格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  align-items: stretch;
}

.power-card {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.power-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.item-name {
  margin: 0 !important;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.type-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}

/* 各類別標籤顏色 */
.badge-hp { background: rgba(239, 68, 68, 0.15); color: #dc2626; }
.badge-buster { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.badge-reg { background: rgba(16, 185, 129, 0.15); color: #059669; }
.badge-sub { background: rgba(236, 72, 153, 0.15); color: #db2777; }
.badge-expand { background: rgba(168, 85, 247, 0.15); color: #9333ea; }
.badge-armor { background: rgba(59, 130, 246, 0.15); color: #2563eb; }

.val-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-left: 6px;
  background: rgba(var(--vp-c-brand-1-rgb), 0.12);
  padding: 1px 5px;
  border-radius: 4px;
}

.price-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ca8a04;
  background: rgba(234, 179, 8, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  flex-grow: 1;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-row .label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.info-row .value {
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.loc-link {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.empty-box {
  text-align: center;
  padding: 2.5rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
}
</style>