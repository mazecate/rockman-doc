---
title: EXE 2 支線任務
aside: false
outline: [2, 4]
---

<script setup>
import questData from '@/data/exe2/sideQuest.json'
</script>

# EXE 2 支線任務

<ClientOnly>
    <SideQuest :questData="questData" />
</ClientOnly>
