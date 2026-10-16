---
title: EXE4 星之證 (徽章)
aside: false
---

# 星之證 (徽章)

<script setup>
import starData from '@/data/exe4/stars.json'
</script>

<ClientOnly>
    <StarChecklist :game-data="starData" />
</ClientOnly>