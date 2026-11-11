<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NaviCustTableData } from '@/theme/types'
import ImagePopUp from './ImagePopUp.vue'

const props = defineProps<{
  data: NaviCustTableData
}>()

const searchQuery = ref('')

// 判斷是否為 EXE 4（EXE 4 沒有壓縮指令）
const showCompression = computed(() => {
  return props.data.series !== 'exe4'
})

// 動態計算總欄數（用於無結果時的 colspan）：名稱、顏色、取得方法、影響、壓縮指令(選填) -> 共 4 或 5 欄
const totalColumns = computed(() => {
  let count = 4 
  if (showCompression.value) count++
  return count
})

// 根據顏色內容動態套用樣式
const getColorClass = (colorStr: string) => {
  if (!colorStr) return 'color-default'
  if (colorStr.includes('粉紅')) return 'color-pink'
  if (colorStr.includes('紅')) return 'color-red'
  if (colorStr.includes('黃')) return 'color-yellow'
  if (colorStr.includes('藍')) return 'color-blue'
  if (colorStr.includes('綠')) return 'color-green'
  if (colorStr.includes('橙')) return 'color-orange'
  if (colorStr.includes('紫')) return 'color-purple'
  if (colorStr.includes('白')) return 'color-white'
  if (colorStr.includes('灰')) return 'color-gray'
  return 'color-default'
}

// 過濾部件列表
const filteredParts = computed(() => {
  if (!props.data?.parts) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.data.parts

  return props.data.parts.filter(part => {
    return (
      (part.nameZh?.toLowerCase().includes(query) ?? false) ||
      (part.nameEn?.toLowerCase().includes(query) ?? false) ||
      (part.nameJp?.toLowerCase().includes(query) ?? false) ||
      (part.color?.toLowerCase().includes(query) ?? false) ||
      (part.method?.toLowerCase().includes(query) ?? false) ||
      (part.effect?.toLowerCase().includes(query) ?? false) ||
      (part.compressionCommand?.toLowerCase().includes(query) ?? false)
    )
  })
})
</script>

<template>
  <div class="navicust-container">
    <!-- 頂部提示訊息 -->
    <div class="remind-box">
      💡 <strong>提示：</strong>在程式零件按住 ZL/ZR 鍵就可以開始輸入壓縮指令。
    </div>

    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜尋名稱、顏色、取得方法、效果或壓縮指令..." 
        class="search-input" 
      />
    </div>

    <div class="table-scroll-wrapper">
      <div class="table-scroll-inner">
        <table class="navicust-table">
          <thead>
            <tr id="thead">
              <th>名稱</th>
              <th>顏色</th>
              <th>取得方法</th>
              <th>影響（效果）</th>
              <th v-if="showCompression">壓縮指令</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(part, index) in filteredParts" :key="index">
              <td>
                <ImagePopUp v-if="part.image" :src="`/images/${part.image}`" :alt="part.nameZh">
                  <span class="name-zh has-image">{{ part.nameZh || '-' }}</span>
                </ImagePopUp>
                <span v-else class="name-zh">{{ part.nameZh || '-' }}</span>
              </td>
              <td>
                <span :class="['color-badge', getColorClass(part.color)]">
                  {{ part.color }}
                </span>
              </td>
              <td class="method-cell">{{ part.method }}</td>
              <td class="effect-cell">{{ part.effect || '-' }}</td>
              <td v-if="showCompression">
                <span v-if="part.compressionCommand" class="code-tag">{{ part.compressionCommand }}</span>
                <span v-else>-</span>
              </td>
            </tr>
            <tr v-if="filteredParts.length === 0">
              <td :colspan="totalColumns" class="no-result">沒有找到符合的程式部件</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navicust-container {
  margin: 1rem 0;
}
.remind-box {
  padding: 10px 14px;
  margin-bottom: 1rem;
  background-color: var(--vp-c-bg-alt);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 4px;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}
.search-box {
  margin-bottom: 1rem;
}
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

.table-scroll-wrapper {
  position: relative;
  overflow: hidden;
}
@media (max-width: 767px) {
  .table-scroll-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    box-shadow: inset -15px 0 15px -10px rgba(176, 161, 161, 0.15); 
  }
}
.table-scroll-inner {
  overflow-x: auto;
}
.navicust-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  white-space: nowrap;
  margin-top: 0px !important;
}
.navicust-table th,
.navicust-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
}
.navicust-table th {
  background-color: var(--vp-c-bg-alt);
  font-weight: 600;
}
.name-zh {
  font-weight: bold;
}
.name-zh.has-image {
  cursor: pointer;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.name-zh.has-image:hover {
  color: var(--vp-c-brand-2);
}

/* 顏色標籤樣式 */
.color-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--vp-c-divider);
}
.color-red { background-color: rgba(239, 68, 68, 0.12); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
.color-yellow { background-color: rgba(234, 179, 8, 0.12); color: #eab308; border-color: rgba(234, 179, 8, 0.3); }
.color-blue { background-color: rgba(59, 130, 246, 0.12); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); }
.color-green { background-color: rgba(34, 197, 94, 0.12); color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }
.color-pink { background-color: rgba(236, 72, 153, 0.12); color: #ec4899; border-color: rgba(236, 72, 153, 0.3); }
.color-orange { background-color: rgba(249, 115, 22, 0.12); color: #f97316; border-color: rgba(249, 115, 22, 0.3); }
.color-purple { background-color: rgba(168, 85, 247, 0.12); color: #a855f7; border-color: rgba(168, 85, 247, 0.3); }
.color-white { background-color: rgba(255, 255, 255, 0.1); color: var(--vp-c-text-1); }
.color-gray { background-color: rgba(107, 114, 128, 0.12); color: #9ca3af; }
.color-default { background-color: var(--vp-c-bg-alt); color: var(--vp-c-text-2); }

.effect-cell, .method-cell {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.code-tag {
  display: inline-block;
  padding: 2px 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
}
.no-result {
  text-align: center;
  font-style: italic;
  padding: 20px;
  color: var(--vp-c-text-2);
}
</style>