---
isGameTheme: false
title: EXE2 領航員位置
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE2 領航員位置</h1>

<script setup>
import naviData from '@/data/exe2/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe2" />
</ClientOnly>
