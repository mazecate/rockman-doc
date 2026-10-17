---
isGameTheme: false
title: EXE1 領航員位置
# lastUpdatedDate: '2026-02-01'
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE1 領航員位置</h1>

<script setup>
import naviData from '@/data/exe1/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe1" />
</ClientOnly>
