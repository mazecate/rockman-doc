<script setup lang="ts">
import type { SideQuestData } from './types'

defineProps<{
  questData: SideQuestData
}>()
</script>

<template>
  <div class="quest-checklist" v-if="questData && questData.side_missions">
    <div v-for="(group, gIdx) in questData.side_missions" :key="gIdx" class="chapter-section">
      <h3 class="chapter-title">{{ group.chapter }}</h3>
      
      <div class="quest-grid">
        <div 
          v-for="(quest, qIdx) in group.missions" 
          :key="qIdx" 
          class="quest-card"
        >
          <div class="quest-header">
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
    </div>
  </div>
</template>

<style scoped>
.quest-checklist {
  margin: 1.5rem 0;
  font-family: var(--vp-font-family-base);
}

.chapter-section {
  margin-bottom: 2.5rem;
}

.chapter-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-brand-1);
  padding-bottom: 6px;
  margin-bottom: 1.2rem;
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
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
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
  .quiz-ans {
    grid-template-columns: 1fr;
  }
}
</style>