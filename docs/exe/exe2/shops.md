---
title: EXE2 商店
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE2 商店</h1>

<script setup>
import shopsData from '@/data/exe2/shopsData.json'
</script>

<ClientOnly>
  <ShopTable :shops="shopsData" title="搜尋" />
</ClientOnly>