---
title: EXE 2 Bug 碎片全收集地點
aside: false
---

# Bug 碎片全收集地點

<script setup lang="ts">
// import BugFragList from '@/components/BugFragList.vue'
// import bugFragSource from '@/data/exe2/bugfrags.json'
// import type { BugFragDataset } from '@/types'

import dataset from '@/data/exe2/bugfrags.json'
</script>

<ClientOnly>
  <BugFragList :source="dataset" storage-key="exe2-bugfrags" />
</ClientOnly>