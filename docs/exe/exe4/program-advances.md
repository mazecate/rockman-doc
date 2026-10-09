---
title: EXE4 PA程式進化
---

<h1 id="asset-handling" tabindex="-1">EXE4 Program Advance (P.A.) 圖鑑</h1>

<script setup>
import paData from '@/data/paData.json'
</script>

<ClientOnly>
  <PaTable :items="paData" title="搜尋" />
</ClientOnly>