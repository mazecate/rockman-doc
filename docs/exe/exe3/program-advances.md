---
title: EXE3 PA程式進化
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE3 Program Advance (P.A.) 圖鑑</h1>

<script setup>
import paData from '@/data/exe3/paData.json'
</script>

<ClientOnly>
  <PaTable :items="paData" title="搜尋" />
</ClientOnly>