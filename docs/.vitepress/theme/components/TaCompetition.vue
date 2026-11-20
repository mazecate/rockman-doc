<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TaBoss, TaProgressRecord, LocalizedText, FolderLocStep } from '../types'

const props = withDefaults(defineProps<{
  items: readonly TaBoss[]
  notice?: readonly LocalizedText[]
  folderLoc?: readonly FolderLocStep[]
  storageKey?: string
}>(), { storageKey: 'exe3_ta_progress' })

const query = ref('')
const locationFilter = ref('all')
const statusFilter = ref<'all' | 'todo' | 'cleared' | 'passed'>('all')
const sortBy = ref<'default' | 'time' | 'name'>('default')
const progress = ref<Record<string, TaProgressRecord>>({})

onMounted(() => {
  const saved = localStorage.getItem(props.storageKey)
  if (saved) progress.value = JSON.parse(saved)
})

const save = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(progress.value))
}

const parseTime = (time: string): number | null => {
  const t = time.trim()
  if (!t) return null
  if (/^\d+$/.test(t)) return Number(t)
  const parts = t.split(':').map(Number)
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return null
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return null
}

const formatTime = (seconds: number | null | undefined): string => {
  if (seconds == null) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

const getLocationLabel = (boss: TaBoss) => boss.location.zh || boss.location.ja
const getFolderLabels = (boss: TaBoss) => boss.folder.map((f) => f.zh || f.ja)
const getNote = (boss: TaBoss) => boss.note?.zh || boss.note?.ja || ''

const isCleared = (id: string) => !!progress.value[id]?.cleared
const isPassed = (boss: TaBoss) => {
  const best = progress.value[boss.id]?.bestTimeSeconds
  const target = parseTime(boss.targetTime)
  return best != null && target != null && best <= target
}

const toggleCleared = (id: string) => {
  if (!progress.value[id]) progress.value[id] = { bestTimeSeconds: null, cleared: false }
  progress.value[id].cleared = !progress.value[id].cleared
  save()
}

const onBestTimeChange = (id: string, value: string) => {
  if (!progress.value[id]) progress.value[id] = { bestTimeSeconds: null, cleared: false }
  progress.value[id].bestTimeSeconds = parseTime(value)
  save()
}

const locations = computed(() => [...new Set(props.items.map((i) => getLocationLabel(i)))])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = props.items.filter((boss) => {
    if (locationFilter.value !== 'all' && getLocationLabel(boss) !== locationFilter.value) return false
    if (statusFilter.value === 'cleared' && !isCleared(boss.id)) return false
    if (statusFilter.value === 'todo' && isCleared(boss.id)) return false
    if (statusFilter.value === 'passed' && !isPassed(boss)) return false
    if (q) {
      const hay = [
        boss.name.zh, boss.name.ja, boss.name.en,
        boss.location.zh, boss.location.ja, boss.location.en,
        ...boss.folder.flatMap((f) => [f.zh, f.ja, f.en]),
        boss.id
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
  if (sortBy.value === 'time') {
    list = [...list].sort((a, b) => (parseTime(a.targetTime) ?? Infinity) - (parseTime(b.targetTime) ?? Infinity))
  }
  if (sortBy.value === 'name') list = [...list].sort((a, b) => a.name.zh.localeCompare(b.name.zh))
  return list
})

const total = computed(() => props.items.length)
const clearedCount = computed(() => props.items.filter((b) => isCleared(b.id)).length)
const passedCount = computed(() => props.items.filter((b) => isPassed(b)).length)
const progressPercent = computed(() => total.value ? Math.round((clearedCount.value / total.value) * 100) : 0)
</script>

<template>
  <div class="ta-wrapper">
    <div v-if="notice && notice.length" class="prereq-banner">
      <div class="prereq-title">📌 TA競賽規則</div>
      <ol class="prereq-list">
        <li v-for="(item, i) in notice" :key="i" v-html="item.zh || item.ja" />
      </ol>
    </div>

    <div v-if="folderLoc && folderLoc.length" class="folder-loc">
      <div class="folder-loc-title">📁 推薦資料夾</div>
      <div class="folder-loc-grid">
        <figure v-for="(step, i) in folderLoc" :key="i" class="folder-loc-card">
          <img :src="step.image" :alt="step.name.zh" class="folder-loc-img" loading="lazy" />
          <figcaption>
            <strong>{{ step.name.zh }}</strong>
            <span>{{ step.loc.zh }}</span>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="ta-stats">
      <span>已擊破 <strong>{{ clearedCount }} / {{ total }}</strong></span>
      <span>已達標 <strong>{{ passedCount }}</strong></span>
      <div class="ta-progress-bar"><div class="ta-progress-fill" :style="{ width: progressPercent + '%' }" /></div>
      <span>{{ progressPercent }}%</span>
    </div>

    <div class="ta-controls">
      <input v-model="query" class="ta-search" placeholder="搜尋 Boss：閃光人 / フラッシュマン / FlashMan" />
      <select v-model="locationFilter" class="ta-select">
        <option value="all">全部地點</option>
        <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
      </select>
      <select v-model="statusFilter" class="ta-select">
        <option value="all">全部狀態</option>
        <option value="todo">未擊破</option>
        <option value="cleared">已擊破</option>
        <option value="passed">已達標</option>
      </select>
      <select v-model="sortBy" class="ta-select">
        <option value="default">預設排序</option>
        <option value="time">時間短到長</option>
        <option value="name">名稱排序</option>
      </select>
    </div>

    <div class="ta-grid">
      <div
        v-for="boss in filtered"
        :key="boss.id"
        class="ta-card"
        :class="{ 'card-cleared': isCleared(boss.id), 'card-passed': isPassed(boss) }"
      >
        <div class="card-header">
          <div class="name-block">
            <h3>{{ boss.name.zh || boss.name.ja }}</h3>
            <!-- <span v-if="boss.name.ja" class="ja-name">{{ boss.name.ja }}</span>
            <span v-if="boss.name.en" class="en-name">{{ boss.name.en }}</span> -->
          </div>
          <span class="location-badge">{{ getLocationLabel(boss) }}</span>
        </div>
        <p class="location-label">📍 {{ getLocationLabel(boss) }}</p>

        <div class="time-row">
          <div>
            <span class="time-label">⏱️ 預設擊破時間</span>
            <strong class="time-big">{{ formatTime(parseTime(boss.targetTime) ?? 0) }}</strong>
          </div>
          <div>
            <span class="time-label">我的最佳時間</span>
            <input
              class="time-input"
              placeholder="00:10:00"
              :value="formatTime(progress[boss.id]?.bestTimeSeconds)"
              @change="onBestTimeChange(boss.id, ($event.target as HTMLInputElement).value)"
            />
            <span v-if="progress[boss.id]?.bestTimeSeconds != null" class="time-result">
              {{ isPassed(boss) ? '✅ 已達標' : '❌ 未達標' }}
            </span>
          </div>
        </div>

        <div class="folder-row">
          <span class="folder-label">📁 建議：</span>
          <span v-for="(f, i) in boss.folder" :key="i" class="folder-chip">{{ f.zh || f.ja }}</span>
        </div>

        <p v-if="boss.note" class="boss-note">⚠️ {{ getNote(boss) }}</p>

        <button class="check-btn" @click="toggleCleared(boss.id)">
          {{ isCleared(boss.id) ? '✅ 已擊破' : '⭕ 標記擊破' }}
        </button>
      </div>
    </div>

    <p v-if="filtered.length === 0" class="empty">冇符合條件嘅 Boss，試下清走篩選。</p>
  </div>
</template>

<style scoped>
.ta-wrapper { margin-top: 1.5rem; }
.prereq-banner {
  background: var(--vp-c-tip-soft, rgba(59, 130, 246, 0.1));
  border-left: 4px solid var(--vp-c-brand-1, #3b82f6);
  border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
}
.prereq-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.4rem; }
.prereq-list { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6; }
.folder-loc { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
.folder-loc-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.75rem; }
.folder-loc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
@media (max-width: 768px) { .folder-loc-grid { grid-template-columns: repeat(2, 1fr); } }
.folder-loc-card { margin: 0; }
.folder-loc-img { width: 100%; border-radius: 8px; border: 1px solid var(--vp-c-divider); display: block; }
.folder-loc-card figcaption { margin-top: 0.5rem; font-size: 0.85rem; line-height: 1.5; }
.folder-loc-card figcaption strong { display: block; }
.folder-loc-card figcaption span { color: var(--vp-c-text-2); }
.ta-stats { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; margin-bottom: 1rem; flex-wrap: wrap; }
.ta-progress-bar { flex: 1; min-width: 120px; height: 8px; background: var(--vp-c-bg-mute); border-radius: 999px; overflow: hidden; }
.ta-progress-fill { height: 100%; background: #10b981; transition: width 0.3s; }
.ta-controls {
  position: sticky; top: 64px; z-index: 10;
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  background: var(--vp-c-bg); padding: 0.75rem; border: 1px solid var(--vp-c-divider);
  border-radius: 10px; margin-bottom: 1.25rem;
}
.ta-search { flex: 1; min-width: 200px; padding: 6px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); }
.ta-select { padding: 6px 8px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); }
.ta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
.ta-card { background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 1.25rem; transition: all 0.3s; }
.ta-card:hover { border-color: var(--vp-c-brand-1); }
.ta-card.card-cleared { border-color: #10b981; border-left-width: 5px; }
.ta-card.card-passed { background: rgba(16, 185, 129, 0.05); }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; border-bottom: 2px solid var(--vp-c-brand-1); padding-bottom: 0.5rem; margin-bottom: 0.75rem; }
.name-block h3 { margin: 0; font-size: 1.1rem; line-height: 1.3; }
.ja-name { display: block; font-size: 0.85rem; color: var(--vp-c-text-2); margin-top: 2px; }
.en-name { display: block; font-size: 0.8rem; color: var(--vp-c-text-2); font-style: italic; }
.location-badge { font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: #3b82f6; color: white; white-space: nowrap; }
.location-label { font-size: 0.9rem; margin: 0.25rem 0 0.75rem; }
.time-row { display: flex; justify-content: space-between; gap: 1rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 0.75rem; margin-bottom: 0.75rem; }
.time-label { display: block; font-size: 0.75rem; color: var(--vp-c-text-2); margin-bottom: 2px; }
.time-big { font-family: ui-monospace, monospace; font-size: 1.35rem; letter-spacing: 0.03em; }
.time-input { width: 100px; padding: 4px 6px; font-family: ui-monospace, monospace; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); }
.time-result { display: block; font-size: 0.8rem; margin-top: 4px; }
.folder-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; margin-bottom: 0.75rem; }
.folder-label { font-size: 0.85rem; font-weight: 600; }
.folder-chip { display: inline-block; font-size: 0.85rem; font-weight: 600; padding: 3px 8px; border-radius: 6px; background: var(--vp-c-brand-soft); }
.boss-note { font-size: 0.85rem; color: var(--vp-c-text-2); }
.check-btn { width: 100%; margin-top: 0.6rem; padding: 5px; font-size: 0.85rem; background: var(--vp-c-bg-mute); border: 1px solid var(--vp-c-divider); border-radius: 6px; cursor: pointer; }
.check-btn:hover { background: var(--vp-c-brand-soft); }
.empty { text-align: center; color: var(--vp-c-text-2); padding: 2rem 0; }
</style>
