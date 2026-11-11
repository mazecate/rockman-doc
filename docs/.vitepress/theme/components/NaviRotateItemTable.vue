<!-- @/components/NaviItemTable.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NaviRotateItemTableData } from '@/theme/types'
import ImagePopUp from './ImagePopUp.vue'

const props = defineProps<{
  data: NaviRotateItemTableData
}>()

const searchQuery = ref('')

// 過濾道具列表
const filteredItems = computed(() => {
  if (!props.data?.items) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.data.items

  return props.data.items.filter(item => {
    return (
      (item.nameZh?.toLowerCase().includes(query) ?? false) ||
      (item.nameEn?.toLowerCase().includes(query) ?? false) ||
      (item.nameJp?.toLowerCase().includes(query) ?? false) ||
      (item.method?.toLowerCase().includes(query) ?? false) ||
      (item.effect?.toLowerCase().includes(query) ?? false)
    )
  })
})
</script>

<template>
  <div class="navicust-container">
    <div class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜尋道具名稱、英文、取得方法或效果..." 
        class="search-input" 
      />
    </div>

    <div class="table-scroll-wrapper">
      <div class="table-scroll-inner">
        <table class="navicust-table">
          <thead>
            <tr id="thead">
              <th>名稱</th>
              <th>取得方法</th>
              <th>影響（效果）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="index">
              <td>
                <!-- 如果有圖片，點擊名稱即開啟彈窗 -->
                <ImagePopUp v-if="item.image" :src="`/images/${item.image}`" :alt="item.nameZh">
                  <span class="name-zh has-image">{{ item.nameZh }}</span>
                </ImagePopUp>
                <!-- 沒有圖片則純顯示文字 -->
                <span v-else class="name-zh">{{ item.nameZh }}</span>
              </td>
              <td class="method-cell">{{ item.method }}</td>
              <td class="effect-cell">{{ item.effect || '-' }}</td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="3" class="no-result">沒有找到符合的道具</td>
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
.method-cell, .effect-cell {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.no-result {
  text-align: center;
  font-style: italic;
  padding: 20px;
  color: var(--vp-c-text-2);
}
</style>