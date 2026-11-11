---
title: EXE3 旋轉零件
aside: false
---

# EXE 3 旋轉零件

<script setup>
import rotateItemData from '@/data/exe3/naviRotateItem.json'
</script>

<ClientOnly>
  <NaviRotateItemTable :data="rotateItemData" />
</ClientOnly>