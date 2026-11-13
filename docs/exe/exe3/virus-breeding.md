---
title: EXE 3 病毒飼育
aside: false
outline: [2, 4]
---

<script setup>
// import VirusBreeding from '../components/VirusBreeding.vue'
import exe3Viruses from '@/data/exe3/virusBreedingData.json'
</script>

# 洛克人 EXE 3 飼育病毒圖鑑

點擊下方卡片按鈕可記錄你的病毒收集進度（進度會自動儲存在瀏覽器中）。

<ClientOnly>
  <VirusBreeding :items="exe3Viruses" storage-key="exe3_virus_progress" />
</ClientOnly>