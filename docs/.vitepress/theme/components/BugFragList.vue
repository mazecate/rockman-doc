<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// import ImagePopUp from './ImagePopUp.vue'
import type { BugFragDataset, BugFragItem } from '../types'

const props = defineProps<{
  source: BugFragDataset
  storageKey?: string
}>()

const activeCategory = ref<'all' | 'real' | 'net'>('all')
const checkedIds = ref<string[]>([])
const justCheckedId = ref<string | null>(null)
const celebrateComplete = ref(false)

let animTimer: ReturnType<typeof setTimeout> | null = null
let completeTimer: ReturnType<typeof setTimeout> | null = null

const STORAGE_KEY = computed(
  () => props.storageKey || `${props.source.game}-${props.source.category}-checked`
)

const items = computed<BugFragItem[]>(() => props.source.data || [])

const isCompleted = computed(
  () => items.value.length > 0 && checkedIds.value.length >= items.value.length
)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY.value)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        checkedIds.value = parsed
      }
    } catch {
      checkedIds.value = []
    }
  }
})

watch(
  checkedIds,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY.value, JSON.stringify(newVal))
  },
  { deep: true }
)

watch(isCompleted, (done, prevDone) => {
  if (done && !prevDone) {
    celebrateComplete.value = true
    if (completeTimer) clearTimeout(completeTimer)
    completeTimer = setTimeout(() => {
      celebrateComplete.value = false
    }, 1200)
  } else if (!done) {
    celebrateComplete.value = false
  }
})

function toggleCheck(id: string) {
  const idx = checkedIds.value.indexOf(id)
  if (idx > -1) {
    checkedIds.value.splice(idx, 1)
    if (justCheckedId.value === id) {
      justCheckedId.value = null
    }
  } else {
    checkedIds.value.push(id)
    justCheckedId.value = id
    if (animTimer) clearTimeout(animTimer)
    animTimer = setTimeout(() => {
      if (justCheckedId.value === id) {
        justCheckedId.value = null
      }
    }, 650)
  }
}

function isChecked(id: string): boolean {
  return checkedIds.value.includes(id)
}

function hasImage(item: BugFragItem): boolean {
  return Boolean(item.locationImage && item.locationImage.trim().length > 0)
}

function getNoteZh(item: BugFragItem): string {
  return item.note?.zh?.trim() || ''
}

const progressPercent = computed(() => {
  if (!items.value.length) return 0
  return Math.round((checkedIds.value.length / items.value.length) * 100)
})

const groupedItems = computed(() => {
  const filtered = items.value.filter(
    (item) => activeCategory.value === 'all' || item.category === activeCategory.value
  )

  const groups: Record<string, BugFragItem[]> = {}
  filtered.forEach((item) => {
    if (!groups[item.region]) {
      groups[item.region] = []
    }
    groups[item.region].push(item)
  })

  return groups
})

function resetAll() {
  if (confirm('確定要清除所有收集勾選紀錄嗎？')) {
    checkedIds.value = []
    justCheckedId.value = null
    celebrateComplete.value = false
  }
}
</script>

<template>
  <div class="bugfrag-container">
    <!-- 1. 頂部收集進度與商店提示 -->
    <div
      :class="[
        'progress-card',
        {
          'is-completed': isCompleted,
          'is-celebrating': celebrateComplete
        }
      ]"
    >
      <div class="progress-header">
        <div class="progress-title-wrap">
          <strong class="progress-title">👾 Bug 碎片收集進度</strong>
          <span v-if="isCompleted" class="complete-badge">🎉 收集完成！</span>
          <span class="progress-count">
            已收集 <b>{{ checkedIds.length }}</b> / {{ items.length }} 處 ({{ progressPercent }}%)
          </span>
        </div>
        <button v-if="checkedIds.length > 0" class="reset-btn" @click="resetAll">
          重設紀錄
        </button>
      </div>

      <div class="progress-bar-bg">
        <div
          class="progress-bar-fill"
          :class="{ completed: isCompleted }"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>

      <div class="shop-tip">
        <span class="shop-tip-badge">🛒 商店提示</span>
        <span>Bug 碎片商店在 <b>長壽廣場 2</b></span>
      </div>
    </div>

    <!-- 2. 大分類切換 Tabs -->
    <div class="filter-tabs">
      <button
        :class="['tab-btn', { active: activeCategory === 'all' }]"
        @click="activeCategory = 'all'"
      >
        🌐 全部地點
      </button>
      <button
        :class="['tab-btn', { active: activeCategory === 'real' }]"
        @click="activeCategory = 'real'"
      >
        💻 現實電腦
      </button>
      <button
        :class="['tab-btn', { active: activeCategory === 'net' }]"
        @click="activeCategory = 'net'"
      >
        🟣 網路區域
      </button>
    </div>

    <!-- 3. 按地區分組的清單 -->
    <div v-for="(list, regionName) in groupedItems" :key="regionName" class="region-group">
      <div class="region-header">
        <span class="region-title">📍 {{ regionName }}</span>
        <span class="region-sub-count">
          {{ list.filter((i) => isChecked(i.id)).length }} / {{ list.length }}
        </span>
      </div>

      <div class="checklist-items">
        <div
          v-for="item in list"
          :key="item.id"
          :class="[
            'check-row',
            {
              'is-checked': isChecked(item.id),
              'is-just-checked': justCheckedId === item.id
            }
          ]"
          @click="toggleCheck(item.id)"
        >
          <!-- 動畫打勾按鈕 -->
          <button
            type="button"
            role="checkbox"
            :aria-checked="isChecked(item.id)"
            :aria-label="`標記 ${item.location.zh}`"
            :class="['tick-box', { checked: isChecked(item.id) }]"
            @click.stop="toggleCheck(item.id)"
          >
            <svg viewBox="0 0 24 24" class="tick-svg" fill="none" stroke="currentColor" stroke-width="3">
              <polyline
                class="tick-path"
                points="20 6 9 17 4 12"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="item-content">
            <div class="item-title-row">
              <span class="item-name">{{ item.location.zh }}</span>

              <!-- 圖片彈窗元件觸發區（無外框與底色，僅單一 Icon） -->
              <span v-if="hasImage(item)" class="image-trigger" @click.stop>
                <ImagePopUp :src="item.locationImage" :alt="item.location.zh">
                  <span
                    class="img-icon-btn"
                    title="查看位置截圖"
                    :aria-label="`查看 ${item.location.zh} 位置截圖`"
                  >
                    📷
                  </span>
                </ImagePopUp>
              </span>
            </div>
            <span v-if="getNoteZh(item)" class="item-note">{{ getNoteZh(item) }}</span>
          </div>

          <span :class="['cat-tag', item.category]">
            {{ item.category === 'real' ? '現實' : '網路' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bugfrag-container {
  margin: 1.5rem 0;
}

.progress-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 1rem;
  transition: background 0.35s ease, border-color 0.35s ease, transform 0.25s ease;
}

.progress-card.is-completed {
  border-color: rgba(16, 185, 129, 0.55);
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.13),
    var(--vp-c-bg-soft) 72%
  );
}

.progress-card.is-celebrating {
  animation: complete-pulse 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
  flex-wrap: wrap;
}

.progress-title-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.progress-title {
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.complete-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #059669;
  background: rgba(16, 185, 129, 0.18);
  animation: badge-pop 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.progress-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.reset-btn {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  padding: 3px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.reset-btn:hover {
  color: #dc2626;
  border-color: #dc2626;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: var(--vp-c-divider);
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.3s ease, background 0.35s ease;
}

.progress-bar-fill.completed {
  background: linear-gradient(90deg, #10b981, #059669);
}

.shop-tip {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  color: var(--vp-c-text-1);
}

.shop-tip-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ca8a04;
  background: rgba(234, 179, 8, 0.15);
  padding: 2px 7px;
  border-radius: 4px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.region-group {
  margin-bottom: 1.4rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 0.95rem;
}

.region-sub-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  padding: 2px 8px;
  border-radius: 10px;
}

.checklist-items {
  display: flex;
  flex-direction: column;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: background 0.2s, opacity 0.25s, transform 0.2s;
}

.check-row:last-child {
  border-bottom: none;
}

.check-row:hover {
  background: var(--vp-c-bg-soft);
}

.check-row.is-checked {
  opacity: 0.6;
}

.check-row.is-checked .item-name {
  text-decoration: line-through;
  color: var(--vp-c-text-2);
}

.check-row.is-just-checked {
  animation: row-flash 0.6s ease;
}

/* 自訂打勾框與動畫 */
.tick-box {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 6px;
  border: 2px solid var(--vp-c-divider);
  background: transparent;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.tick-box:hover {
  border-color: var(--vp-c-brand-1);
}

.tick-box.checked {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  animation: tick-pop 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.tick-svg {
  width: 14px;
  height: 14px;
}

.tick-path {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 0.22s ease 0.05s;
}

.tick-box.checked .tick-path {
  stroke-dashoffset: 0;
}

@keyframes tick-pop {
  0% {
    transform: scale(0.8);
  }
  55% {
    transform: scale(1.18);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes row-flash {
  0% {
    background-color: rgba(16, 185, 129, 0.16);
  }
  100% {
    background-color: transparent;
  }
}

@keyframes complete-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45);
  }
  50% {
    transform: scale(1.015);
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes badge-pop {
  0% {
    transform: scale(0.75);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.item-name {
  font-size: 0.93rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.image-trigger {
  display: inline-flex;
  align-items: center;
}

.img-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  line-height: 1;
  opacity: 0.8;
  transition: transform 0.15s ease, opacity 0.2s ease;
}

.img-icon-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

.item-note {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.cat-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.cat-tag.real {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.cat-tag.net {
  background: rgba(168, 85, 247, 0.15);
  color: #9333ea;
}
</style>