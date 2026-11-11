---
title: EXE3 程式零件
aside: false
---

# EXE 3 程式零件

<script setup>
// import NaviCustTable from '@/components/NaviCustTable.vue'
import exe3NaviCustData from '@/data/exe3/naviCust.json'
</script>

<ClientOnly>
  <NaviCustTable :data="exe3NaviCustData" />
  <ReferenceList :items="['appmedia']" />
</ClientOnly>