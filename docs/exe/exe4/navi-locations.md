---
title: EXE4 V2 / V3 / SP / DS / XX 領航員位置
aside: false
---

# EXE4 領航員位置

<script setup>
import naviData from '@/data/exe4/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe4" />
  <ReferenceList :items="['game8']" />
</ClientOnly>


