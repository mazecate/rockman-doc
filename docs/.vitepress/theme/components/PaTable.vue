<template>
  <div class="pa-container">
    <h2>Program Advance (P.A.) 圖鑑</h2>

    <!-- 搜尋列 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋 PA 名稱、晶片組合或效果..."
      />
    </div>

    <!-- 表格顯示 (Table Display) -->
    <div class="table-wrapper">
      <table class="pa-table">
        <thead>
          <tr>
            <th class="col-seq">NO.</th>
            <th class="col-name">P.A. 名稱</th>
            <th class="col-combo">晶片組合</th>
            <th class="col-desc">效果說明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in formattedData" :key="item.seqNo">
            <td class="col-seq">#{{ item.seqNo }}</td>
            <td class="col-name">
              <div class="name-zh">{{ item.nameZh }}</div>
              <div class="name-en" v-if="item.nameEn">{{ item.nameEn }}</div>
            </td>
            <td class="col-combo">
              <!-- 多組組合直接分行展示，不顯示斜線 '/' -->
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

<script setup>
import { ref, computed } from 'vue'
import paData from '@/data/paData.json'

// 1. 響應式資料（深拷貝，避免直接改動原始 JSON import）
const paList = ref(structuredClone(paData))

// 2. 背景資料異動檢查狀態
const originalJsonSnapshot = ref(JSON.stringify(paData))
const isDataChanged = computed(() => {
  return JSON.stringify(paList.value) !== originalJsonSnapshot.value
})

// 3. 搜尋關鍵字狀態
const searchQuery = ref('')

// 輔助函式：解析 JSON 內的配方，若有 '/' 自動切分成多個替代組合陣列
const formatCombinations = (combo) => {
  if (!combo) return []
  // 若為二維陣列（多組配方）
  if (Array.isArray(combo) && Array.isArray(combo[0])) {
    return combo
  }
  // 若為一維陣列（單組配方）
  if (Array.isArray(combo)) {
    return [combo]
  }
  // 若為字串，用 '/' 切分成獨立的替代組合，再用 '+' 解析單一晶片
  if (typeof combo === 'string') {
    return combo.split('/').map((group) => group.split('+').map((c) => c.trim()))
  }
  return []
}

// 4. computed：搜尋篩選與連貫編號生成
const formattedData = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  const filtered = paList.value.filter((item) => {
    if (!query) return true

    const comboGroups = formatCombinations(item.combination)
    const allChips = comboGroups.flat()

    const matchNameZh = item.nameZh.toLowerCase().includes(query)
    const matchNameEn = item.nameEn?.toLowerCase().includes(query) ?? false
    const matchDesc = item.description.toLowerCase().includes(query)
    const matchCombo = allChips.some((c) => c.toLowerCase().includes(query))

    return matchNameZh || matchNameEn || matchDesc || matchCombo
  })

  return filtered.map((item, index) => ({
    ...item,
    seqNo: index + 1,
    comboGroups: formatCombinations(item.combination),
  }))
})
</script>

<style scoped>
/* 容器與外層結構 */
.pa-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
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

/* 100% 滿版表格結構 (table-layout: fixed) */
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

/* 1. Light Theme 下的晶片標籤（柔和沉穩、不刺眼） */
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

/* 2. Dark Theme 下的晶片標籤（清晰、透亮） */
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