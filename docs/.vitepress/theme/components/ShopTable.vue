<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShopGroup } from '../types';

const props = defineProps<{
  shops: ShopGroup[]
}>()

const searchQuery = ref('')
const selectedShop = ref('ALL')

// 扁平化陣列（Flat Array）
const flatItems = computed(() => {
  const list: { 
    shopName: string; 
    shopNameEn?: string; 
    shopNameJp?: string; 
    itemName: string; 
    itemNameEn?: string; 
    itemNameJp?: string; 
    price: number | string; 
    currency: string; 
    quantity?: number;
    version?: 'black' | 'white' | string; // 新增版本屬性
    type?: string
  }[] = []
  
  props.shops.forEach(shop => {
    shop.items.forEach(item => {
      list.push({
        shopName: shop.shopName,
        shopNameEn: shop.shopNameEn,
        shopNameJp: shop.shopNameJp,
        itemName: item.name,
        itemNameEn: item.nameEn,
        itemNameJp: item.nameJp,
        price: item.price,
        currency: shop.currency,
        quantity: item.quantity,
        version: item.version,
        type: shop.type
      })
    })
  })
  
  return list;
})

const shopList = computed(() => {
  return ['ALL', ...props.shops.map(shop => shop.shopName)]
})

const filteredItems = computed(() => {
  return flatItems.value.filter(item => {
    const matchesShop = selectedShop.value === 'ALL' || item.shopName === selectedShop.value
    const query = searchQuery.value.trim().toLowerCase()
    const matchesQuery = !query || 
      item.itemName.toLowerCase().includes(query) || 
      item.shopName.toLowerCase().includes(query)
    
    return matchesShop && matchesQuery
  })
})
</script>

<template>
  <div class="shop-container">
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋商品名稱或商店..."
        class="search-input"
      />
      <select v-model="selectedShop" class="shop-select">
        <option v-for="shop in shopList" :key="shop" :value="shop">
          {{ shop === 'ALL' ? '全部商店' : shop }}
        </option>
      </select>
    </div>

    <!-- Flexbox 商品卡片列表 -->
    <div class="shop-grid">
      <div 
        v-for="(item, index) in filteredItems" 
        :key="index" 
        class="shop-card"
        :class="{ 'has-ribbon': item.version }"
      >
        <!-- 右上角斜角緞帶 (專門處理 3 代版本限定) -->
        <div 
          v-if="item.version" 
          class="version-ribbon"
          :class="`ribbon-${item.version.toLowerCase()}`"
        >
          {{ item.version.toLowerCase() === 'black' ? '黑版' : item.version.toLowerCase() === 'white' ? '白版' : item.version }}
        </div>

        <div class="card-header">
          <span class="shop-badge">{{ item.shopName }}</span>
        </div>
        <div class="card-body">
          <span class="item-name">
            {{ item.itemName }}
            <span v-if="item.quantity && item.quantity > 1" class="item-quantity">x{{ item.quantity }}</span>
          </span>
          
          <div class="item-right">
            <span class="price" :class="item.currency">
              {{ typeof item.price === 'number' ? item.price.toLocaleString() + ' Z' : item.price }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="no-data">
        找不到符合的商品
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-container {
  margin: 1.5rem 0;
  width: 100%;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.search-input, .shop-select {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.shop-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.shop-card {
  position: relative; /* 必須：讓右上角緞帶絕對定位於卡片內 */
  overflow: hidden;    /* 必須：切掉超出卡片邊界斜出的緞帶 */
  flex: 1 1 calc(33.333% - 16px);
  min-width: 260px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.shop-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

/* --- 右上角斜帶 (Ribbon) 樣式 --- */
.version-ribbon {
  position: absolute;
  top: 10px;
  right: -32px;
  width: 100px;
  transform: rotate(45deg);
  text-align: center;
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 2px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* 黑版限定樣式 */
.ribbon-black {
  background-color: #1f2937;
  color: #f3f4f6;
  border: 1px solid #374151;
}

/* 白版限定樣式 */
.ribbon-white {
  background-color: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  padding: 2px 8px;
  border-radius: 4px;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.item-name {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-quantity {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.price {
  font-weight: bold;
  font-family: monospace;
  font-size: 1rem;
  white-space: nowrap;
}

.price.Zenny {
  color: #f59e0b;
}

.price.bugFrag {
  color: #ff40ff;
}

.no-data {
  width: 100%;
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 40px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
</style>