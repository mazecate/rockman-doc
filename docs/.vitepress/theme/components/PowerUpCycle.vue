<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PowerUpRoundItemEntry } from '../types'


const props = defineProps<{
  items: PowerUpRoundItemEntry[];
}>();

const searchQuery = ref('');
const selectedCycle = ref('全部');
const selectedCategory = ref('全部');

const categoryNames: Record<string, string> = {
  reg: '常規 UP',
  hp: 'HP記憶體',
  parts: '程式部件',
  expand: '擴張記憶體',
  side: '副記憶體',
  shop: '商店'
};

const cycles = [1, 2, 3];

const getMethodStyle = (item: PowerUpRoundItemEntry) => {
  // 檢查是否為 parts 類型（或是你的 Rotate Parts 類型，可依實際 JSON 的 type 調整）
  if (item.type === 'parts') {
    if (item.method.includes('藍')) {
      return { color: '#30D5C8' };
    }
    if (item.method.includes('紫')) {
      return { color: '#800080' };
    }
  }
  return {};
};

const getItemsByCycle = (cycleNum: number) => {
  return props.items.filter(item => {
    if (item.type === 'shop') return false;

    const matchesCycleSelect = selectedCycle.value === '全部' || item.cycle.toString() === selectedCycle.value;
    const matchesCycleNum = item.cycle === cycleNum;

    const query = searchQuery.value.toLowerCase();
    const matchesQuery = 
      item.method.toLowerCase().includes(query) || 
      item.location.toLowerCase().includes(query) ||
      (item.name && item.name.toLowerCase().includes(query));
    
    const matchesCategory = selectedCategory.value === '全部' || item.type === selectedCategory.value;

    return matchesCycleSelect && matchesCycleNum && matchesQuery && matchesCategory;
  });
};

const shopItems = computed(() => {
  return props.items.filter(item => {
    if (item.type !== 'shop') return false;
    const query = searchQuery.value.toLowerCase();
    const matchesQuery = item.location.toLowerCase().includes(query) || (item.price && item.price.toLowerCase().includes(query));
    const matchesCategory = selectedCategory.value === '全部' || selectedCategory.value === 'shop';
    const matchesCycle = selectedCycle.value === '全部';
    return matchesQuery && matchesCategory && matchesCycle;
  });
});

const showShopSection = computed(() => {
  return selectedCategory.value === '全部' || selectedCategory.value === 'shop';
});

const totalShopPrice = computed(() => {
  return props.items
    .filter(item => item.type === 'shop' && item.price)
    .reduce((total, item) => {
      const num = parseInt(item.price!.replace(/[,zZ]/g, ''), 10) || 0;
      return total + num;
    }, 0)
    .toLocaleString() + 'Z';
});
</script>

<template>
  <div class="guide-container">
    <!-- 頂部搜尋與分類控制列 -->
    <div class="controls">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="搜尋名稱、入手方法或地點..." 
        class="search-input"
      />
      <select v-model="selectedCycle" class="filter-select">
        <option value="全部">所有周目</option>
        <option value="1">1周目</option>
        <option value="2">2周目</option>
        <option value="3">3周目</option>
      </select>
      <select v-model="selectedCategory" class="filter-select">
        <option value="全部">所有分類</option>
        <option v-for="(name, key) in categoryNames" :key="key" :value="key">
          {{ name }}
        </option>
      </select>
    </div>

    <!-- 1. 商店專屬 Card Box (置頂摺疊) -->
    <div v-if="showShopSection && shopItems.length > 0" class="cycle-card-box shop-box">
      <details class="shop-details" open>
        <summary class="box-header">
          <div class="summary-title">
            <h2>🛒 商店 HP 記憶體購買一覽</h2>
            <span class="shop-tip">全買齊需合計 {{ totalShopPrice }}</span>
          </div>
          <span class="toggle-icon">▼</span>
        </summary>

        <div class="box-body">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="col-type">分類</th>
                  <th class="col-name">購買項目</th>
                  <th class="col-loc">商店地點與價格</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in shopItems" :key="idx">
                  <td class="col-type">
                    <span class="type-tag tag-shop">商店</span>
                  </td>
                  <td class="col-name">
                    <strong>HP 記憶體</strong>
                  </td>
                  <td class="col-loc">
                    <span class="loc-text">📍 {{ item.location }}</span>
                    <span class="price-badge">（{{ item.price }}）</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>

    <!-- 2. 3個大 Card Box (1、2、3 周目) -->
    <div class="cycles-wrapper">
      <div 
        v-for="cycle in cycles" 
        :key="cycle" 
        class="cycle-card-box"
        v-show="selectedCycle === '全部' || selectedCycle === cycle.toString()"
      >
        <div class="box-header">
          <h2>{{ cycle }} 周目指南</h2>
        </div>

        <div class="box-body">
          <div v-if="getItemsByCycle(cycle).length > 0" class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="col-type">分類</th>
                  <th class="col-name">入手方法 / 道具名稱</th>
                  <th class="col-loc">地點</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in getItemsByCycle(cycle)" :key="idx">
                  <td class="col-type">
                    <span :class="['type-tag', `tag-${item.type}`]">{{ categoryNames[item.type] }}</span>
                  </td>
                  <td class="col-name">
                    <strong :style="getMethodStyle(item)">{{ item.name || item.method }}</strong>
                    <span v-if="item.value" class="val-badge">+{{ item.value }}</span>
                  </td>
                  <td class="col-loc">
                    <ImagePopUp :src="item.locationImage">
                      <span class="loc-text">📍 {{ item.location }}</span>
                    </ImagePopUp>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="no-data-box">
            此周目無符合條件的項目
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-container {
  margin: 1.5rem 0;
  width: 100%;
  font-family: inherit;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input, .filter-select {
  padding: 10px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

.cycles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.cycle-card-box {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shop-box {
  margin-bottom: 2rem;
  margin-top: 0;
}

.shop-details {
  margin: 0;
  padding: 0;
}

.shop-details summary.box-header {
  list-style: none;
  cursor: pointer;
}

.shop-details summary.box-header::-webkit-details-marker {
  display: none;
}

.box-header {
  background: var(--vp-c-bg-soft);
  padding: 14px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  border-top: none !important;
  margin-top: 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
}

.box-header h2 {
  margin: 0 !important;
  border-top: none !important;
  padding-top: 0 !important;
  font-size: 1.25rem;
  color: var(--vp-c-brand-1);
}

.shop-tip {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.toggle-icon {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  transition: transform 0.2s;
  margin-left: 10px;
  flex-shrink: 0;
}

.shop-details[open] .toggle-icon {
  transform: rotate(180deg);
}

.box-body {
  padding: 16px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
  min-width: 500px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

th {
  color: var(--vp-c-text-2);
  font-weight: 600;
  background: var(--vp-c-bg);
}

tr:last-child td {
  border-bottom: none;
}

.col-type { width: 130px; }
.col-name { width: 180px; }
.col-loc { width: auto; }

.type-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
  text-align: center;
}

.tag-reg {
  background-color: rgba(16, 185, 129, 0.15) !important;
  color: #059669 !important;
  border: 1px solid rgba(16, 185, 129, 0.3) !important;
}

.tag-hp {
  background-color: rgba(239, 68, 68, 0.15) !important;
  color: #dc2626 !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
}

.tag-rotate, .tag-parts {
  background-color: rgba(59, 130, 246, 0.15) !important;
  color: #2563eb !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
}

.tag-expand {
  background-color: rgba(168, 85, 247, 0.15) !important;
  color: #9333ea !important;
  border: 1px solid rgba(168, 85, 247, 0.3) !important;
}

.tag-side {
  border: 1px solid rgba(236, 72, 153, 0.3) !important;
  background: rgba(236, 72, 153, 0.15) ;
  color: #db2777;
}

.tag-shop {
  background-color: rgba(234, 179, 8, 0.18) !important;
  color: #ca8a04 !important;
  border: 1px solid rgba(234, 179, 8, 0.35) !important;
}

.val-badge {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  margin-left: 6px;
}

.price-badge {
  color: #e6a700;
  font-weight: 600;
  margin-left: 6px;
}

.loc-text {
  color: var(--vp-c-text-1);
}

.no-data-box {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 20px;
  font-size: 0.95rem;
}
</style>