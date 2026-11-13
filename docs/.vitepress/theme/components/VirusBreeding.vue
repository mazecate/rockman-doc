<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { VirusItem, VirusProgressRecord } from '../types'
import { isTemplateExpression } from 'typescript';

const props = withDefaults(defineProps<{
  items: VirusItem[]
  storageKey?: string
}>(), {
  storageKey: 'exe3_virus_progress'
})

const progress = ref<Record<string, VirusProgressRecord>>({})
// 效果完全一樣 with ref<...>
// const progress = ref({} as Record<string, VirusProgressRecord>)

onMounted(() => {
  const saved = localStorage.getItem(props.storageKey)
  if (saved) {
    progress.value = JSON.parse(saved)
  }
})

const toggleDone = (id: string, type: 'normal' | 'sp') => {
  if (!progress.value[id]) {
    progress.value[id] = { normal: false, sp: false }
  }
  progress.value[id][type] = !progress.value[id][type]
  localStorage.setItem(props.storageKey, JSON.stringify(progress.value))
}

// 計算該病毒是否通常版與 SP 版都已完成
const isAllCompleted = (id: string) => {
  const item = progress.value[id]
  return item && item.normal && item.sp
}
</script>

<template>
  <div class="virus-breeding-wrapper">
    <!-- 前置條件提示區 -->
    <div class="prereq-banner">
      <div class="prereq-title">📌 飼育條件說明</div>
      <ol class="prereq-list">
        <li>要完成第7章的支線任務「<strong>請領養這些病毒</strong>」</li>
        <li>取得 SP 病毒必需<strong>完成了表關</strong>，且同一種病毒<strong>餵食累積 100 個 BUG 碎片</strong></li>
      </ol>
    </div>

    <!-- 病毒卡片網格 -->
    <div class="virus-grid">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="virus-card"
        :class="{ 'card-completed': isAllCompleted(item.id) }"
      >
        <div class="card-header">
          <h3>
            <!-- 完成時帶有動畫的左側大 Tick -->
            <Transition name="bounce">
              <span v-if="isAllCompleted(item.id)" class="completed-icon" title="完美全達成！">✅</span>
            </Transition>
            {{ item.name.zh || item.name.ja }}
            <span v-if="item.name.zh && item.name.zh !== item.name.ja" class="jp-name">
              ({{ item.name.ja }})
            </span>
          </h3>
        </div>

        <div class="versions-container">
          <!-- 通常版 -->
          <div class="version-box normal" :class="{ done: progress[item.id]?.normal }">
            <div class="version-tag">通常版</div>
            <p>
              <strong>📍 位置：</strong>
              <ImagePopUp :src="item.normal.image" :alt="item.name.zh + ' 通常版位置'">
                {{ item.normal.location.zh || item.normal.location.ja }}
                <span v-if="item.normal.image" class="popup-hint"> 🔍</span>
              </ImagePopUp>
            </p>
            <p><strong>🎁 報酬：</strong>{{ item.normal.rewards.zh || item.normal.rewards.ja }}</p>
            <button @click="toggleDone(item.id, 'normal')" class="check-btn">
              {{ progress[item.id]?.normal ? '✅ 已完成' : '⭕ 標記完成' }}
            </button>
          </div>

          <!-- SP版 -->
          <!-- <div class="version-box sp" :class="{ done: progress[item.id]?.sp }">
            <div class="version-tag sp-tag">SP版</div>
            <p>
              <strong>📍 位置：</strong>
              <ImagePopUp :src="item.sp.image" :alt="item.name.zh + ' SP版位置'">
                {{ item.sp.location.zh || item.sp.location.ja }}
                <span v-if="item.sp.image" class="popup-hint"> 🔍</span>
              </ImagePopUp>
            </p>
            <p><strong>🎁 報酬：</strong>{{ item.sp.rewards.zh || item.sp.rewards.ja }}</p>
            <button @click="toggleDone(item.id, 'sp')" class="check-btn">
              {{ progress[item.id]?.sp ? '✅ 已完成' : '⭕ 標記完成' }}
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virus-breeding-wrapper {
  margin-top: 1.5rem;
}

.prereq-banner {
  background: var(--vp-c-tip-soft, rgba(59, 130, 246, 0.1));
  border-left: 4px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.prereq-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
  color: var(--vp-c-text-1);
}

.prereq-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.prereq-list li {
  margin: 0.2rem 0;
}

.virus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

/* 卡片基礎樣式 */
.virus-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.virus-card:hover {
  border-color: var(--vp-c-brand-1);
}

/* ==========================================
   Light Mode 下的「已完成」卡片特效
   ========================================== */
.virus-card.card-completed {
  background: rgba(16, 185, 129, 0.05); /* 輕透且乾淨的綠色 */
  border-color: #10b981;
  border-left-width: 5px; /* 增加左側粗邊框作為完成識別 */
}

/* ==========================================
   Dark Mode 下的「已完成」卡片特效
   ========================================== */
html.dark .virus-card.card-completed {
  background: rgba(16, 185, 129, 0.1); /* 暗色模式下稍微亮一點點 */
  border-color: #34d399;
  border-left-width: 5px;
}

.card-header h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.jp-name {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: normal;
}

.version-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 0.85rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: opacity 0.3s ease;
}

.version-box:last-child {
  margin-bottom: 0;
}

.version-box p {
  margin: 0.35rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 單一版本完成時降低透明度 */
.version-box.done {
  opacity: 0.55;
  border-color: #10b981;
}

.version-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
  margin-bottom: 0.4rem;
}

.sp-tag {
  background: #ec4899;
}

.popup-hint {
  font-size: 0.75rem;
  opacity: 0.8;
}

.check-btn {
  width: 100%;
  margin-top: 0.6rem;
  padding: 5px;
  font-size: 0.85rem;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.check-btn:hover {
  background: var(--vp-c-brand-soft);
}

/* ===========================
   動畫效果 (Bounce Animation)
   ================----------- */
.completed-icon {
  font-size: 1rem;
  display: inline-block;
}

.bounce-enter-active {
  animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse ease-in;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>