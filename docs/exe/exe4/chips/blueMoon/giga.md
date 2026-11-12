---
title: EXE 4 藍月亮GIGA晶片圖鑑
aside: false
---

# EXE 4 藍月亮GIGA晶片圖鑑

<script setup>
  import chipsData from '@/data/exe4/chips/blueMoonGigaChips.json'
</script>

<ClientOnly>
  <ChipTable :chips="chipsData" />
</ClientOnly>