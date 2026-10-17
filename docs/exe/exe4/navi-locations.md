---
title: EXE4 V2 / V3 / SP / DS / XX 領航員位置
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE4 領航員位置</h1>

<script setup>
import naviData from '@/data/exe4/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe4" />
  <ReferenceList :items="['game8']" />
</ClientOnly>


