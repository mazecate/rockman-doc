---
title: EXE1 強化部件
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE1 強化部件</h1>

<script setup>
import powerUpData from '@/data/exe1/powerUpData.json'
</script>

<ClientOnly>
  <PowerUp :items="powerUpData" />
</ClientOnly>
