---
title: EXE1 晶片交換
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE1 晶片交換</h1>

<script setup>
import chipTradeData from '@/data/exe1/chipTradeData.json'
</script>

<ClientOnly>
    <ChipTradeTable :tradeData="chipTradeData" />
</ClientOnly>