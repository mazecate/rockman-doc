---
title: EXE4 數字交易機
aside: false
---

# EXE3 數字交易機

<script setup>
import numberTradeData from '@/data/exe3/numberTradeData.json'
</script>

<ClientOnly>
  <NumberTrader :items="numberTradeData" title="搜尋" />
  <ReferenceList :items="['fandom_mmbn3_lotto']" />
</ClientOnly>