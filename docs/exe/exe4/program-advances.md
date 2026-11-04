---
title: EXE4 PA程式進化
aside: false
---

# EXE4 Program Advance (P.A.) 圖鑑

<script setup>
import paData from '@/data/exe4/paData.json'
</script>

<ClientOnly>
  <PaTable :items="paData" title="搜尋" />
</ClientOnly>