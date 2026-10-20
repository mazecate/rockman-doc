<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SideQuestData } from '../types'

const props = defineProps<{
  questData: SideQuestData
}>()

// 搜尋關鍵字與選中的章節
const searchQuery = ref('')
const selectedChapter = ref('')

// 將原本巢狀結構（side_missions 裡的 group.missions）攤平成一維的任務清單，並自動附加 chapter 屬性
const allMissions = computed(() => {
  if (!props.questData || !props.questData.side_missions) return []
  
  const list: Array<{ chapter: string; title: string; trigger_location: string; content: string; answers?: string[]; reward: string }> = []
  
  props.questData.side_missions.forEach(group => {
    group.missions.forEach(mission => {
      list.push({
        chapter: group.chapter,
        ...mission
      })
    })
  })
  
  return list
})

// 從資料中自動提取所有不重複的章節列表，用作下拉選單選項
const availableChapters = computed(() => {
  const chapters = allMissions.value.map(item => item.chapter)
  return Array.from(new Set(chapters))
})

// 綜合過濾（同時支援關鍵字搜尋與章節下拉選單）
const filteredMissions = computed(() => {
  return allMissions.value.filter(item => {
    // 1. 章節篩選邏輯
    const matchChapterSelect = !selectedChapter.value || item.chapter === selectedChapter.value
    
    // 2. 關鍵字搜尋邏輯（支援章節、標題、地點、內容、獎勵）
    let matchQuery = true
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      const matchChapter = item.chapter.toLowerCase().includes(query)
      const matchTitle = item.title.toLowerCase().includes(query)
      const matchLocation = item.trigger_location.toLowerCase().includes(query)
      const matchContent = item.content.toLowerCase().includes(query)
      const matchReward = item.reward.toLowerCase().includes(query)
      const matchAnswers = item.answers ? item.answers.some(ans => ans.toLowerCase().includes(query)) : false
      
      matchQuery = matchChapter || matchTitle || matchLocation || matchContent || matchReward || matchAnswers
    }
    
    return matchChapterSelect && matchQuery
  })
})
</script>

<template>
  <div class="quest-checklist" v-if="questData && questData.side_missions">
    <!-- 篩選與搜尋控制列 -->
    <div class="filter-bar">
      <!-- 搜尋框區域 -->
      <div class="search-input-container">
        <span class="search-icon" aria-hidden="true">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋任務標題、地點、內容或獎勵..." 
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
      找到 {{ filteredMissions.length }} 筆符合的支線任務
    </div>

    <!-- 任務卡片網格 -->
    <div class="quest-grid" v-if="filteredMissions.length > 0">
      <div 
        v-for="(quest, idx) in filteredMissions" 
        :key="idx" 
        class="quest-card"
      >
        <!-- 頂部標頭：章節 Badge + 任務標題 -->
        <div class="quest-header">
          <span class="chapter-badge">{{ quest.chapter }}</span>
          <h4 class="quest-name">{{ quest.title }}</h4>
        </div>

        <div class="quest-details">
          <div class="detail-row">
            <span class="detail-label">📍 地點</span>
            <p class="detail-text location">{{ quest.trigger_location }}</p>
          </div>

          <div class="detail-row">
            <span class="detail-label">📜 內容</span>
            <p class="detail-text">{{ quest.content }}</p>
          </div>

          <div v-if="quest.answers && quest.answers.length > 0" class="quiz-box">
            <div class="quiz-title">💡 問答全解：</div>
            <ul class="quiz-ans">
              <li v-for="(ans, idx) in quest.answers" :key="idx">
                <code class="quiz-item-code">{{ ans }}</code>
              </li>
            </ul>
          </div>

          <div class="detail-row reward-row">
            <span class="detail-label reward-label">🎁 獎勵</span>
            <code class="reward-code">{{ quest.reward }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- 查無結果提示 -->
    <div class="no-result" v-else>
      <p>沒有找到符合條件的支線任務 🥲</p>
    </div>
  </div>
</template>

<style scoped>
.quest-checklist {
  margin: 1.5rem 0;
  font-family: var(--vp-font-family-base);
}

/* 控制列排版 */
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

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

.search-input:focus,
.chapter-select:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
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

.quest-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quest-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.quest-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 章節 Badge 樣式 (對齊 ChipTradeTable) */
.chapter-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.quest-name {
  margin: 0;
  font-weight: 600;
  font-size: 1.15rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.quest-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.detail-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 60px;
  flex-shrink: 0;
}

.detail-text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.location {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.quiz-box {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 12px 16px;
  margin: 4px 0;
}

.quiz-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.quiz-ans {
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quiz-ans li {
  margin: 0 !important;
}

.quiz-item-code {
  display: block;
  font-size: 0.85rem;
  padding: 8px 12px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
}

.reward-row {
  align-items: center;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px dashed var(--vp-c-divider);
}

.reward-code {
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 4px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-weight: 600;
}

@media (max-width: 640px) {
  .filter-bar {
    flex-direction: column;
  }
  .quiz-ans {
    grid-template-columns: 1fr;
  }
  .quest-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>