---
title: EXE3 MEGA晶片圖鑑
aside: false
---

# EXE3 MEGA晶片圖鑑

<script setup>
import chipsData from '@/data/exe3/chips/megaChips.json'
</script>

<ClientOnly>
    <ChipTable :chips="chipsData" />
    <ReferenceList :items="['fandom_mmbn3']" />
</ClientOnly>