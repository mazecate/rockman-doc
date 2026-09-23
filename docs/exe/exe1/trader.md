---
title: EXE1 數字交易機
---

# EXE1 數字交易機 (Number Trader)

<script setup>
const exe1Codes = [
  { code: '90013320', reward: 'Hero Sword P', category: 'BattleChip' },
  { code: '12292026', reward: 'HP Memory', category: 'PowerUp' },
  { code: '32109845', reward: 'Full Custom *', category: 'BattleChip' }
]
</script>

<NumberTrader :items="exe1Codes" />