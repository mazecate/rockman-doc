---
title: EXE 1 支線任務
aside: false
outline: [2, 4]
---

<script setup>
import questData from '@/data/exe1/sideQuest.json'
</script>

# EXE 1 支線任務

<ClientOnly>
    <SideQuest :questData="questData" />
</ClientOnly>

<ReferenceList :items="['prism']" />