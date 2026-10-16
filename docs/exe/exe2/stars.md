---
title: EXE2 星之證
aside: false
---

# 星之證

<script setup>
import starData from '@/data/exe2/stars.json'
</script>

<ClientOnly>
    <StarChecklist :game-data="starData" />
</ClientOnly>