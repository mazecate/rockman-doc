<template>
  <div class="pa-container">
    <h2>{{ title }}</h2>

    <!-- 搜尋列 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋 PA 名稱、編號、晶片組合或效果..."
      />
    </div>

    <!-- 表格顯示 (Table Display) -->
    <div class="table-wrapper">
      <table class="pa-table">
        <thead>
          <tr>
            <th class="col-seq">NO.</th>
            <th class="col-name">P.A. 名稱</th>
            <!-- <th class="col-dmg">威力</th> -->
            <th class="col-combo">晶片組合</th>
            <th class="col-desc">效果說明</th>
          </tr>
        </thead>
        <tbody>
          <!-- 綁定 JSON 資料中固定的 item.no -->
          <tr v-for="item in formattedData" :key="item.no">
            <td class="col-seq">#{{ item.no }}</td>
            <td class="col-name">
              <div class="name-zh">{{ item.nameZh }}</div>
              <div class="name-en" v-if="item.nameEn">{{ item.nameEn }}</div>
            </td>
            <!-- 
            <td class="col-dmg">
              {{ item.damage && item.damage > 0 ? item.damage : '-' }}
            </td> 
            -->
            <td class="col-combo">
              <div class="combo-list">
                <div
                  v-for="(combo, cIndex) in item.comboGroups"
                  :key="cIndex"
                  class="chip-group"
                >
                  <span
                    v-for="(chip, chipIndex) in combo"
                    :key="chipIndex"
                    class="chip-tag"
                  >
                    {{ chip }}
                  </span>
                </div>
              </div>
            </td>
            <td class="col-desc">{{ item.description }}</td>
          </tr>
          <tr v-if="formattedData.length === 0">
            <td colspan="4" class="no-result">
              找不到符合「{{ searchQuery }}」的 P.A. 紀錄
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PaItem, FormattedPaItem } from '../types'

// Props 定義：使用 Vue 3.5+ 響應式解構與預設值
const {
  title = 'Program Advance (P.A.) 圖鑑',
  items = []
} = defineProps<{
  title?: string
  items?: PaItem[]
}>()

/* 
 * 若 Vue 版本 < 3.5，請改用以下 withDefaults 寫法：
 * 
 * const props = withDefaults(
 *   defineProps<{
 *     title?: string
 *     items?: PaItem[]
 *   }>(),
 *   {
 *     title: 'Program Advance (P.A.) 圖鑑',
 *     items: () => []
 *   }
 * )
 */

// 搜尋關鍵字狀態
const searchQuery = ref<string>('')

// 輔助函式：解析 JSON 內的配方
const formatCombinations = (combo: PaItem['combination']): string[][] => {
  if (!combo) return []
  if (Array.isArray(combo) && Array.isArray(combo[0])) {
    return combo as string[][]
  }
  if (Array.isArray(combo)) {
    return [combo as string[]]
  }
  if (typeof combo === 'string') {
    return combo.split('/').map((group) => group.split('+').map((c) => c.trim()))
  }
  return []
}

// computed：搜尋篩選（直接保留原始固定 item.no，且支援搜尋編號）
const formattedData = computed<FormattedPaItem[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return items
    .filter((item) => {
      if (!query) return true

      const comboGroups = formatCombinations(item.combination)
      const allChips = comboGroups.flat()

      const matchNo = item.no.toString().includes(query) // 支援搜尋固定號碼 (如 "30")
      const matchNameZh = item.nameZh.toLowerCase().includes(query)
      const matchNameEn = item.nameEn?.toLowerCase().includes(query) ?? false
      const matchDesc = item.description.toLowerCase().includes(query)
      const matchCombo = allChips.some((c) => c.toLowerCase().includes(query))
      // const matchDmg = item.damage?.toString().includes(query) ?? false

      return matchNo || matchNameZh || matchNameEn || matchDesc || matchCombo /* || matchDmg */
    })
    .map((item) => ({
      ...item,
      comboGroups: formatCombinations(item.combination)
    }))
})
</script>

<style scoped>
/* 容器與外層結構 */
.pa-container {
  width: 100%;
  max-width: 1000px;
  /* margin: 0 auto; */
  padding: 20px 0;
}

/* 搜尋列樣式 */
.search-box {
  margin-bottom: 16px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  font-size: 15px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

/* 表格結構 */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.pa-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
  table-layout: fixed;
}

.pa-table th,
.pa-table td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.pa-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.pa-table tbody tr {
  transition: background-color 0.15s ease;
}

.pa-table tbody tr:hover {
  background-color: var(--vp-c-bg-soft);
}

/* 欄位寬度百分比分配 (總和 100%) */
.col-seq {
  width: 8%;
  text-align: center;
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.col-name {
  width: 22%;
}

.name-zh {
  font-weight: bold;
  color: var(--vp-c-text-1);
}

.name-en {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* 
.col-dmg {
  width: 10%;
  text-align: center;
  font-weight: bold;
  color: #e53e3e;
}

html.dark .col-dmg {
  color: #fc8181;
} 
*/

.col-combo {
  width: 40%;
}

.combo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-bottom: 4px;
}

/* 替代組合分隔線 */
.chip-group:not(:last-child) {
  border-bottom: 1px dashed var(--vp-c-divider);
}

/* 晶片標籤基礎結構 */
.chip-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.825rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: default;
  transition: all 0.2s ease;
  user-select: none;
}

/* Light Theme 下的晶片標籤 */
html:not(.dark) .chip-tag {
  background-color: #f0f4f8;
  color: #2b4c7e;
  border: 1px solid #cbd5e1;
}

html:not(.dark) .chip-tag:hover {
  background-color: #2b4c7e;
  color: #ffffff;
  border-color: #1e3a5f;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(43, 76, 126, 0.2);
}

/* Dark Theme 下的晶片標籤 */
html.dark .chip-tag {
  background-color: rgba(49, 130, 206, 0.15);
  color: #90cdf4;
  border: 1px solid rgba(144, 205, 244, 0.3);
}

html.dark .chip-tag:hover {
  background-color: #3182ce;
  color: #ffffff;
  border-color: #63b3ed;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* 效果說明欄位 */
.col-desc {
  width: 30%;
  color: var(--vp-c-text-1);
  line-height: 1.45;
}

.no-result {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 30px 0;
}
</style>