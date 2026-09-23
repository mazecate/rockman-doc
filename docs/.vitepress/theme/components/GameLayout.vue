<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="custom-game-layout">
    <header class="game-header">
      <div class="banner">🎮 特製主題 - {{ frontmatter.title }}</div>
    </header>
    <div v-if="frontmatter.lastUpdatedDate" class="custom-last-updated">
      <span class="label">最後更新時間：</span>
      <span class="date">{{ frontmatter.lastUpdatedDate }}</span>
    </div>
    <main class="game-content">
      <Content />
    </main>

    <footer class="game-footer">
      <p>Rockman Wiki Custom Theme Mode</p>
    </footer>
  </div>
</template>

<style scoped>
.custom-game-layout {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #00ffcc;
  font-family: 'Courier New', Courier, monospace;
}
.game-header { border-bottom: 2px solid #00ffcc; padding-bottom: 10px; margin-bottom: 20px; }
.banner { font-size: 1.5rem; font-weight: bold; text-shadow: 0 0 10px #00ffcc; }
.game-content { background: rgba(0, 0, 0, 0.6); padding: 25px; border-radius: 8px; border: 1px solid #00ffcc; }
.game-footer { margin-top: 30px; text-align: center; opacity: 0.7; }
</style>