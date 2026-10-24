---
title: EXE 2 晶片交換
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE 2 晶片交換</h1>

<script setup>
import chipTradeData from '@/data/exe2/chipTradeData.json'
</script>

<ClientOnly>
    <ChipTradeTable :tradeData="chipTradeData" />
</ClientOnly>