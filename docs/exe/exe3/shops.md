---
title: EXE3 商店
aside: false
---

# EXE3 商店

<script setup>
import shopsData from '@/data/exe3/shopsData.json'
</script>

<ClientOnly>
  <ShopTable :shops="shopsData" title="搜尋" />
</ClientOnly>