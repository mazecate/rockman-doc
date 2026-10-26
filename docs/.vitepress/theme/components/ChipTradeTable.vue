<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChipTradeData } from '../types'

const props = defineProps<{
  tradeData: ChipTradeData
}>()

// 搜尋關鍵字與選中的章節
const searchQuery = ref('')
const selectedChapter = ref('')

// 從資料中自動提取所有不重複的章節列表，用作 Dropdown 選項
const availableChapters = computed(() => {
  if (!props.tradeData || !props.tradeData.trades) return []
  const chapters = props.tradeData.trades.map(item => item.chapter)
  return Array.from(new Set(chapters))
})

// 綜合過濾（同時支援關鍵字搜尋與章節下拉選單）
const filteredTrades = computed(() => {
  if (!props.tradeData || !props.tradeData.trades) return []
  
  return props.tradeData.trades.filter(item => {
    // 1. 章節篩選邏輯
    const matchChapterSelect = !selectedChapter.value || item.chapter === selectedChapter.value
    
    // 2. 關鍵字搜尋邏輯（支援章節、地點、給予、獲得）
    let matchQuery = true
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      const matchChapter = item.chapter.toLowerCase().includes(query)
      const matchLocation = item.location.toLowerCase().includes(query)
      const matchReceive = item.receive.some(chip => chip.toLowerCase().includes(query))
      const matchGive = item.give.some(chip => chip.toLowerCase().includes(query))
      matchQuery = matchChapter || matchLocation || matchReceive || matchGive
    }
    
    return matchChapterSelect && matchQuery
  })
})
</script>

<template>
  <div class="trade-container" v-if="tradeData && tradeData.trades">
    <!-- 篩選與搜尋控制列（搜尋在前、Filter 在後） -->
    <div class="filter-bar">
      <!-- 搜尋框區域 -->
      <div class="search-input-container">
        <span class="search-icon" aria-hidden="true">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋晶片名稱、代號或地點..." 
          class="search-input"
        />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''" 
          class="clear-btn" 
          title="清除搜尋"
        >
          ✕
        </button>
      </div>

      <!-- 章節下拉選單 -->
      <div class="select-wrapper">
        <select v-model="selectedChapter" class="chapter-select">
          <option value="">全部章節</option>
          <option v-for="chapter in availableChapters" :key="chapter" :value="chapter">
            {{ chapter }}
          </option>
        </select>
      </div>
    </div>

    <!-- 結果計數提示 -->
    <div class="search-count" v-if="searchQuery || selectedChapter">
      找到 {{ filteredTrades.length }} 筆符合的交換
    </div>

    <!-- 晶片交換卡片網格 -->
    <div class="trade-grid" v-if="filteredTrades.length > 0">
      <div 
        v-for="(item, idx) in filteredTrades" 
        :key="idx" 
        class="trade-card"
      >
        <!-- 章節標籤與地點 -->
        <div class="trade-header">
          <span class="chapter-badge">{{ item.chapter }}</span>
          <div class="location-box">
            <span class="detail-label">📍 地點</span>
            <span class="location-text">{{ item.location }}</span>
          </div>
        </div>

        <!-- 晶片交換區域 -->
        <div class="trade-body">
          <!-- 給予晶片 -->
          <div class="chip-section give-section">
            <span class="section-title">📤 需提供晶片</span>
            <ul class="chip-list">
              <li v-for="(chip, cIdx) in item.give" :key="cIdx">
                <code class="chip-code give-code">{{ chip }}</code>
              </li>
            </ul>
          </div>

          <!-- 交換圖示 -->
          <div class="exchange-arrow" aria-hidden="true">
            <span>⇄</span>
          </div>

          <!-- 換得晶片 -->
          <div class="chip-section receive-section">
            <span class="section-title">📥 獲得晶片</span>
            <ul class="chip-list">
                <li v-for="(chip, rIdx) in item.receive" :key="rIdx">
                  <code class="chip-code receive-code">{{ chip }}</code>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 查無結果提示 -->
    <div class="no-result" v-else>
      <p>沒有找到符合條件的晶片交換資料 🥲</p>
    </div>
  </div>
</template>

<style scoped>
.trade-container {
  margin: 1.5rem 0;
  font-family: var(--vp-font-family-base);
}

/* 控制列排版：搜尋框在前，下拉選單在後 */
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

/* 搜尋框區域（佔據主要寬度） */
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 0.95rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  font-size: 0.95rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
}

/* 章節下拉選單樣式 */
.select-wrapper {
  flex-shrink: 0;
}

.chapter-select {
  height: 100%;
  padding: 10px 14px;
  font-size: 0.95rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.chapter-select:focus,
.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.search-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
  padding-left: 4px;
}

.no-result {
  text-align: center;
  padding: 40px 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  background-color: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

/* 卡片與網格樣式 */
.trade-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trade-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.trade-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.trade-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.chapter-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.location-box {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.location-text {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.trade-body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.chip-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.chip-list {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-list li {
  margin: 0 !important;
}

.chip-code {
  display: inline-block;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
}

.give-code {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.receive-code {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-soft);
}

.exchange-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--vp-c-text-3);
  font-weight: bold;
}

@media (max-width: 640px) {
  .filter-bar {
    flex-direction: column;
  }

  .trade-body {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .exchange-arrow {
    transform: rotate(90deg);
    padding: 4px 0;
  }

  .trade-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>