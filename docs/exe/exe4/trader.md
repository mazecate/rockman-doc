---
title: EXE4 數字交易機
aside: false
---

# EXE4 數字交易機

<script setup>
import numberTradeData from '@/data/exe4/numberTradeData.json'
</script>

<ClientOnly>
  <NumberTrader :items="numberTradeData" title="搜尋" />
  <ReferenceList :items="['game8']" />
</ClientOnly>
