<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShopGroup } from '../types/shop';

const props = defineProps<{
  shops: ShopGroup[]
}>()

const searchQuery = ref('')
const selectedShop = ref('ALL')

// 扁平化陣列（Flat Array）
const flatItems = computed(() => {
  const list: { shopName: string; itemName: string; price: number | string; currency: string; quantity?: number }[] = []
  
  props.shops.forEach(shop => {
    shop.items.forEach(item => {
      list.push({
        shopName: shop.shopName,
        itemName: item.name,
        price: item.price,
        currency: shop.currency,
        quantity: item.quantity
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
      >
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
  /* color: #ef4444; */
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