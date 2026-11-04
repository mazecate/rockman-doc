---
title: EXE4 強化部件
aside: false
---

# EXE4 強化部件

<script setup>
import powerUpData from '@/data/exe4/powerUpData.json'
</script>

<ClientOnly>
  <PowerUpCycle :items="powerUpData" />
  <ReferenceList :items="['game8']" />
</ClientOnly>
