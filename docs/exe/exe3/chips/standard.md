---
title: EXE3 標準晶片圖鑑
aside: false
---

# EXE3 標準晶片圖鑑

<script setup>
import chipsData from '@/data/exe3/chips/standardChips.json'
</script>

<ClientOnly>
    <ChipTable :chips="chipsData" />
    <ReferenceList :items="['fandom_mmbn3']" />
</ClientOnly>