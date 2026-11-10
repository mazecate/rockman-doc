---
title: EXE3 白版GIGA晶片圖鑑
aside: false
---

# EXE3 白版GIGA晶片圖鑑

<script setup>
import chipsData from '@/data/exe3/chips/whiteGigaChips.json'
</script>

<ClientOnly>
  <ChipTable :chips="chipsData" />
</ClientOnly>