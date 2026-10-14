---
title: EXE4 V2 / V3 / SP / DS / XX 領航員位置
aside: false
---

<h1 id="asset-handling" tabindex="-1">EXE4 領航員位置</h1>

<script setup>
import naviData from '@/data/exe4/naviLocations.json'
</script>

<ClientOnly>
  <NaviLocation :items="naviData" title="搜尋" edition="exe4" />
</ClientOnly>

## <a id="ref"></a>參考和部份資料來源（部份文字翻譯是根據中文版合集遊戲的文本）：
1. **[Game8 ロックマンエグゼ4攻略｜レッドサン・ブルームーン](https://game8.jp/rockman-exe-4)**