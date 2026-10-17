---
title: EXE4 數字交易機
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE4 數字交易機</h1>

<script setup>
import numberTradeData from '@/data/exe4/numberTradeData.json'
</script>

<ClientOnly>
  <NumberTrader :items="numberTradeData" title="搜尋" />
  <ReferenceList :items="['game8']" />
</ClientOnly>
