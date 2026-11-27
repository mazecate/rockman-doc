<template>
  <div class="item-container">
    <div class="search-box">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜尋名稱、說明或入手方法..."
        class="search-input"
      />
      <div class="result-count">
        <span v-if="seriesLabel">{{ seriesLabel }} · </span>共 {{ totalCount }} 件道具
        <span v-if="searchQuery.trim() || activeVersion !== 'all'">
          · 顯示 {{ filteredItems.length }} 件
        </span>
      </div>
    </div>

    <div v-if="availableVersions.length > 0" class="version-filter">
      <button
        class="filter-pill"
        :class="{ active: activeVersion === 'all' }"
        @click="activeVersion = 'all'"
      >
        全部
      </button>
      <button
        v-for="v in availableVersions"
        :key="v.key"
        class="filter-pill"
        :class="{ active: activeVersion === v.key }"
        @click="activeVersion = v.key"
      >
        <span :class="['version-badge', `version-${v.key}`]">
          <span class="version-icon">{{ v.icon }}</span>
          {{ v.label }}
        </span>
      </button>
    </div>

    <div class="table-scroll-wrapper">
      <div class="table-scroll-inner">
        <table class="item-table">
          <thead>
            <tr>
              <th>名稱</th>
              <th>說明</th>
              <th>入手方法</th>
              <th>版本</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in filteredItems" :key="item.id">
              <tr>
                <td><span class="name-zh">{{ item.name?.zh || '-' }}</span></td>
                <td class="description-cell"><div v-for="(line, i) in splitLines(item.description)" :key="i" class="multi-line">{{ line || '&nbsp;' }}</div></td>
                <td class="obtain-cell"><div v-for="(line, i) in splitLines(item.obtain)" :key="i" class="multi-line">{{ line || '&nbsp;' }}</div></td>
                <td>
                  <div class="versions-cell">
                    <span
                      v-for="meta in getVersionMetas(item.versions)"
                      :key="meta.key"
                      :class="['version-badge', `version-${meta.key}`]"
                    >
                      <span class="version-icon">{{ meta.icon }}</span>
                      {{ meta.label }}
                    </span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredItems.length === 0">
              <td :colspan="totalColumns" class="no-result">沒有找到符合的道具</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GameItem, GameItemFile, ItemVersionKey } from '../types'

const props = defineProps<{ items: GameItem[] | GameItemFile }>()
// 正規化：array 係舊格式，{ series, data } 係新格式
const rawItems = computed(() => (Array.isArray(props.items) ? props.items : props.items.data ?? []))
const series = computed(() => (Array.isArray(props.items) ? null : props.items.series ?? null))
const seriesLabel = computed(() => (series.value ? String(series.value).toUpperCase() : ''))
const searchQuery = ref('')
const activeVersion = ref<string>('all')

const getVersionMeta = (version?: string | null) => {
  const val = (version ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '-')
  switch (val) {
    case '':
    case 'common':
    case 'both':
    case 'all':
    case '共通':
      return { key: 'common', icon: '⚪', label: '共通' }
    case 'exe4-blue-moon':
    case 'exe4-blue':
    case 'blue-moon':
    case 'bluemoon':
    case '藍月':
    case 'exe4-藍月':
      return { key: 'exe4-blue-moon', icon: '🌙', label: 'EXE4 藍月' }
    case 'exe4-red-sun':
    case 'exe4-red':
    case 'red-sun':
    case 'redsun':
    case '紅日':
    case 'exe4-紅日':
      return { key: 'exe4-red-sun', icon: '☀️', label: 'EXE4 紅日' }
    case 'exe4':
      return { key: 'exe4', icon: '🎮', label: 'EXE4' }
    case 'exe5-team-protoman':
    case 'exe5-protoman':
    case 'team-protoman':
    case 'protoman':
    case '布魯斯隊':
      return { key: 'exe5-team-protoman', icon: '🔵', label: 'EXE5 布魯斯隊' }
    case 'exe5-team-colonel':
    case 'exe5-colonel':
    case 'team-colonel':
    case 'colonel':
    case '卡尼爾隊':
      return { key: 'exe5-team-colonel', icon: '🟢', label: 'EXE5 卡尼爾隊' }
    case 'exe5':
      return { key: 'exe5', icon: '🎮', label: 'EXE5' }
    case 'exe6-gregar':
    case 'gregar':
    case '格雷卡':
      return { key: 'exe6-gregar', icon: '🟠', label: 'EXE6 格雷卡' }
    case 'exe6-falzar':
    case 'falzar':
    case '法爾薩':
      return { key: 'exe6-falzar', icon: '🟣', label: 'EXE6 法爾薩' }
    case 'exe6':
      return { key: 'exe6', icon: '🎮', label: 'EXE6' }
    case 'exe3-black':
    case 'exe3black':
      return { key: 'exe3-black', icon: '⚫', label: 'EXE3 Black' }
    case 'exe3':
      return { key: 'exe3', icon: '🎮', label: 'EXE3' }
    case 'exe2':
      return { key: 'exe2', icon: '🎮', label: 'EXE2' }
    case 'exe1':
      return { key: 'exe1', icon: '🎮', label: 'EXE1' }
    default:
      return { key: 'common', icon: '⚪', label: version || '共通' }
  }
}

const getVersionMetas = (versions?: ItemVersionKey[] | null) => {
  if (!versions || versions.length === 0) return [getVersionMeta('common')]
  const seen = new Set<string>()
  return versions
    .map((v) => getVersionMeta(v))
    .filter((meta) => {
      if (seen.has(meta.key + meta.label)) return false
      seen.add(meta.key + meta.label)
      return true
    })
}

// 將 JSON 入面嘅 \n 拆做多行，template 逐行 render，唔靠 CSS 去估
const splitLines = (text?: string | null) => (text || '-').split('\n')

const totalCount = computed(() => {
  return new Set(rawItems.value.map((item) => item.id)).size
})

const VERSION_ORDER = [
  'common',
  'exe1', 'exe2', 'exe3', 'exe3-black',
  'exe4', 'exe4-blue-moon', 'exe4-red-sun',
  'exe5', 'exe5-team-protoman', 'exe5-team-colonel',
  'exe6', 'exe6-gregar', 'exe6-falzar',
]

const availableVersions = computed(() => {
  const map = new Map<string, ReturnType<typeof getVersionMeta>>()
  for (const item of rawItems.value) {
    for (const meta of getVersionMetas(item.versions)) {
      if (!map.has(meta.key)) map.set(meta.key, meta)
    }
  }
  return [...map.values()].sort(
    (a, b) => VERSION_ORDER.indexOf(a.key) - VERSION_ORDER.indexOf(b.key),
  )
})

const totalColumns = 4

const filteredItems = computed(() => {
  if (!rawItems.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  return rawItems.value.filter((item) => {
    if (activeVersion.value !== 'all') {
      const keys = getVersionMetas(item.versions).map((m) => m.key)
      const isCommon = keys.includes('common')
      if (!isCommon && !keys.includes(activeVersion.value)) return false
    }
    if (!query) return true
    const versionLabels = getVersionMetas(item.versions)
      .map((m) => m.label.toLowerCase())
      .join(' ')
    return (
      (item.name?.zh?.toLowerCase().includes(query) ?? false) ||
      (item.name?.en?.toLowerCase().includes(query) ?? false) ||
      (item.name?.ja?.toLowerCase().includes(query) ?? false) ||
      (item.description?.toLowerCase().includes(query) ?? false) ||
      (item.obtain?.toLowerCase().includes(query) ?? false) ||
      versionLabels.includes(query)
    )
  })
})
</script>

<style scoped>
.item-container { margin: 1rem 0; }
.search-box { margin-bottom: 1rem; }
.search-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
}
.result-count { margin-top: 6px; font-size: 0.85rem; color: var(--vp-c-text-2); }
.version-filter { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1rem; }
.filter-pill {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.filter-pill.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}
.filter-pill .version-badge { border: none; background: transparent; padding: 0 6px; }
.table-scroll-wrapper { position: relative; overflow: hidden; }
@media (max-width: 767px) {
  .table-scroll-wrapper::before {
    content: "";
    position: absolute;
    top: 0; right: 0;
    width: 20px; height: 100%;
    pointer-events: none; z-index: 2;
    box-shadow: inset -15px 0 15px -10px rgba(176, 161, 161, 0.15);
  }
}
.table-scroll-inner { overflow-x: auto; }
.item-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 0.95rem;
  white-space: nowrap;
  margin-top: 0px !important;
}
.item-table th, .item-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}
.item-table th { background-color: var(--vp-c-bg-alt); font-weight: 600; }
.name-zh { font-weight: bold; }
.description-cell { font-size: 0.9rem; color: var(--vp-c-text-2); white-space: pre; vertical-align: top; }
.obtain-cell { font-size: 0.9rem; white-space: pre-line; vertical-align: top; }
.multi-line { white-space: pre-line; line-height: 1.5; }
.multi-line:empty::before { content: "\00a0"; }
.versions-cell { display: flex; flex-wrap: wrap; gap: 4px; }
.no-result { text-align: center; font-style: italic; padding: 20px; color: var(--vp-c-text-2); }
.version-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
}
.version-icon { font-size: 0.85rem; }
.version-common, .version-exe1, .version-exe2, .version-exe3, .version-exe4, .version-exe5, .version-exe6 {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
}
.version-exe3-black { background-color: rgba(31, 41, 55, 0.15); color: #374151; }
.version-exe4-blue-moon { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.version-exe4-red-sun { background-color: rgba(239, 68, 68, 0.15); color: #ef4444; }
.version-exe5-team-protoman { background-color: rgba(14, 165, 233, 0.15); color: #0284c7; }
.version-exe5-team-colonel { background-color: rgba(22, 163, 74, 0.15); color: #16a34a; }
.version-exe6-gregar { background-color: rgba(249, 115, 22, 0.15); color: #ea580c; }
.version-exe6-falzar { background-color: rgba(139, 92, 246, 0.15); color: #7c3aed; }
</style>
