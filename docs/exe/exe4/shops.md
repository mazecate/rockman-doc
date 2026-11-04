---
title: EXE4 商店
aside: false
---

# EXE4 商店

<script setup>
import shopsData from '@/data/exe4/shopsData.json'
</script>

<ClientOnly>
  <ShopTable :shops="shopsData" title="搜尋" />
</ClientOnly>