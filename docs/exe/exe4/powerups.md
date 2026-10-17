---
title: EXE4 強化部件
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE4 強化部件</h1>

<script setup>
// import PowerUpCycle from '../components/PowerUpCycle.vue'
import powerUpData from '@/data/exe4/powerUpData.json'
</script>

<ClientOnly>
  <PowerUpCycle :items="powerUpData" />
  <ReferenceList :items="['game8']" />
</ClientOnly>
