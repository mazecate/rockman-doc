---
title: EXE 4 支線任務
aside: false
outline: [2, 4]
---

<script setup>
import questData from '@/data/exe4/sideQuest.json'
</script>

# EXE 4 支線任務

<ClientOnly>
  <EXE4SpecialQuest 
    v-for="(item, index) in questData" 
    :key="index" 
    :quest="item" 
  />
</ClientOnly>