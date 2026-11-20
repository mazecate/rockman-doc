---
title: EXE3 TA挑戰
aside: false
---

# 🏆 EXE 3 TA挑戰

<script setup>
import taObj from '@/data/exe3/ta.json'
</script>

<ClientOnly>
  <TaCompetition :items="taObj.data" :notice="taObj.notice" :folderLoc="taObj.folderLoc" />
</ClientOnly>
