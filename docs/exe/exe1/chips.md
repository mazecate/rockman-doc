---
title: EXE1 晶片圖鑑
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE1 晶片圖鑑</h1>

<script setup>
import chipsData from '@/data/exe1/chipsData.json'
</script>

<ClientOnly>
    <ChipTable :chips="chipsData" />
    <ReferenceList :items="['wily']" />
</ClientOnly>