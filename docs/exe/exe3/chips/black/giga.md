---
title: EXE3 黑版GIGA晶片圖鑑
aside: false
---

# EXE3 黑版GIGA晶片圖鑑

<script setup>
import chipsData from '@/data/exe3/chips/blackGigaChips.json'
</script>

<ClientOnly>
  <ChipTable :chips="chipsData" />
</ClientOnly>