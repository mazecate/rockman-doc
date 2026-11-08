---
isGameTheme: false
title: EXE3 領航員位置
aside: false
---

# EXE3 領航員位置

<script setup>
import naviData from '@/data/exe3/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe3" />
</ClientOnly>
