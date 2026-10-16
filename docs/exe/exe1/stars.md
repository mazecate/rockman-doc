---
title: EXE1 星之證
aside: false
---

# 星之證
<img src="/images/exe1/e1_stars.jpeg" alt="" class="imgW">

<script setup>
import starData from '@/data/exe1/stars.json'
</script>

<ClientOnly>
    <StarChecklist :game-data="starData" />
</ClientOnly>