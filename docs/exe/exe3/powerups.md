---
title: EXE3 強化部件
aside: false
---

# EXE3 強化部件

<script setup>
import powerUpData from '@/data/exe3/powerUpData.json'
</script>

<ClientOnly>
  <PowerUp :items="powerUpData" />
</ClientOnly>
