<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EXE4SpecialQuestData } from '../types'

const props = defineProps<{
  quest: EXE4SpecialQuestData
}>()

const checkedParts = ref<Record<number, boolean>>({})

// 檢查是否所有零件都已經打勾
const allPartsChecked = computed(() => {
  if (!props.quest.assembly || !props.quest.assembly.parts) return false
  const totalParts = props.quest.assembly.parts.length
  if (totalParts === 0) return false
  
  return props.quest.assembly.parts.every((_, idx) => checkedParts.value[idx])
})
</script>

<template>
  <div class="special-quest-card" v-if="quest && quest.meta">
    <!-- 頂部標頭 -->
    <div class="quest-header">
      <span class="quest-type-badge" :class="quest.meta.type">
        {{ quest.meta.type === 'timeline' ? '☀️ 劇情/時間軸支線' : '🛹 零件/組裝支線' }}
      </span>
      <h3 class="quest-title">{{ quest.meta.title }}</h3>
    </div>

    <!-- 任務說明與前置條件 -->
    <div class="quest-meta-box">
      <p v-if="quest.meta.description" class="quest-desc">{{ quest.meta.description }}</p>

      <div class="meta-tags">
        <div v-if="quest.meta.totalCost" class="meta-item cost">
          💰 總花費：{{ quest.meta.totalCost }}
        </div>
        <div v-if="quest.meta.reward" class="meta-item reward">
          🎁 獎勵：{{ quest.meta.reward }}
        </div>
      </div>

      <div v-if="quest.meta.prerequisites && quest.meta.prerequisites.length > 0" class="prereq-box">
        <span class="box-label">⚠️ 前置條件與準備：</span>
        <ul>
          <li v-for="(item, idx) in quest.meta.prerequisites" :key="idx">{{ item }}</li>
        </ul>
      </div>
    </div>

    <!-- 模式 A：時間軸型 -->
    <div v-if="quest.meta.type === 'timeline' && quest.steps" class="timeline-container">
      <div v-for="step in quest.steps" :key="step.stepNumber" class="timeline-item">
        <div class="timeline-badge">{{ step.stepNumber }}</div>
        <div class="timeline-content">
          <div class="step-location">📍 {{ step.location }}</div>
          <p class="step-text">{{ step.content }}</p>
          <div v-if="step.tips" class="step-tip">
            💡 <strong>提示：</strong>{{ step.tips }}
          </div>
        </div>
      </div>

      <div v-if="quest.meta.hiddenFeatures && quest.meta.hiddenFeatures.length > 0" class="hidden-box">
        <span class="box-label">🔓 隱藏要素：</span>
        <ul>
          <li v-for="(feat, idx) in quest.meta.hiddenFeatures" :key="idx">{{ feat }}</li>
        </ul>
      </div>
    </div>

    <!-- 模式 B：零件收集與組裝型 -->
    <div v-if="quest.meta.type === 'assembly' && quest.assembly" class="assembly-container">
      <h4 class="section-title">🛠️ 零件收集清單</h4>
      
      <div class="parts-grid">
        <div 
          v-for="(part, idx) in quest.assembly.parts" 
          :key="idx" 
          class="part-card"
          :class="{ 'is-checked': checkedParts[idx] }"
          @click="checkedParts[idx] = !checkedParts[idx]"
        >
          <div class="part-card-header">
            <input type="checkbox" v-model="checkedParts[idx]" class="part-checkbox" @click.stop />
            <span class="part-name">📦 {{ part.name }}</span>
            
            <!-- 🟢 打勾時彈出的徽章動畫 -->
            <transition name="stamp-pop">
              <span v-if="checkedParts[idx]" class="checked-stamp">✓</span>
            </transition>
          </div>
          <div class="part-detail">📍 地點：{{ part.location }}</div>
          <div class="part-detail cost-text">💵 花費：{{ part.cost }}</div>
        </div>
      </div>

      <!-- ⚙️ 零件組裝（全選時亮燈） -->
      <div class="assembly-final-box" :class="{ 'all-completed': allPartsChecked }">
        <h4 class="section-title assembly-title">
          {{ allPartsChecked ? '✨ 零件已齊全！可以去組裝囉！' : '⚙️ 零件組裝' }}
        </h4>
        <div class="final-detail">
          <p><strong>📜 組裝：</strong>{{ quest.assembly.assemblyText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.special-quest-card {
  margin: 1.5rem 0;
  padding: 20px;
  border-radius: 10px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-base);
}
.quest-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.quest-type-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}
.quest-type-badge.timeline {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.quest-type-badge.assembly {
  background-color: rgba(234, 179, 8, 0.15);
  color: #d97706;
}
.quest-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.quest-meta-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.quest-desc {
  margin: 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}
.meta-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.meta-item {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.prereq-box, .hidden-box {
  background-color: var(--vp-c-bg-soft);
  border-left: 4px solid var(--vp-c-brand-1);
  padding: 10px 14px;
  border-radius: 0 6px 6px 0;
  font-size: 0.9rem;
}
.prereq-box ul, .hidden-box ul {
  margin: 4px 0 0 18px !important;
  padding: 0 !important;
}
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.timeline-item {
  display: flex;
  gap: 14px;
}
.timeline-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.timeline-content {
  flex-grow: 1;
  background-color: var(--vp-c-bg);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
.step-location {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 4px;
}
.step-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
.step-tip {
  margin-top: 8px;
  font-size: 0.85rem;
  padding: 6px 10px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  color: var(--vp-c-text-2);
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 16px 0 10px 0;
  color: var(--vp-c-text-1);
}
.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.part-card {
  background-color: var(--vp-c-bg);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.part-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
.part-card.is-checked {
  opacity: 0.65;
  background-color: var(--vp-c-bg-soft);
  border-color: #10b981;
  transform: scale(0.98);
}
.part-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  position: relative;
}
.part-checkbox {
  cursor: pointer;
}
.part-name {
  font-weight: 700;
  font-size: 0.95rem;
}

/* 🟢 打勾徽章樣式與彈跳動畫 */
.checked-stamp {
  margin-left: auto;
  width: 22px;
  height: 22px;
  background-color: #10b981;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}
.stamp-pop-enter-active {
  animation: bounce-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.stamp-pop-leave-active {
  transition: opacity 0.15s ease;
  opacity: 0;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.25);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.part-detail {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.cost-text {
  color: #d97706;
  font-weight: 600;
}

/* ⚙️ 組裝區塊與亮燈特效 */
.assembly-final-box {
  margin-top: 16px;
  background-color: var(--vp-c-bg);
  padding: 14px 18px;
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  transition: all 0.4s ease;
}
.assembly-final-box.all-completed {
  background-color: rgba(16, 185, 129, 0.1);
  border: 2px solid #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}
.assembly-final-box.all-completed .assembly-title {
  color: #059669;
}
.assembly-title {
  margin-top: 0;
}
.final-detail p {
  margin: 4px 0;
  font-size: 0.9rem;
}
@media (max-width: 640px) {
  .parts-grid {
    grid-template-columns: 1fr;
  }
}
</style>