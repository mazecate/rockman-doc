<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import GameLayout from './GameLayout.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <!-- 偵測 md Frontmatter 是否帶有 layout: custom-game-theme 或 isGameTheme: true -->
  <GameLayout v-if="frontmatter.layout === 'custom-game-theme' || frontmatter.isGameTheme" />
  
  <!-- 否則使用 VitePress 預設主題 Layout -->
  <Layout v-else />
  <!-- <Layout v-else>
    <template #layout-bottom>
      <footer v-if="frontmatter.layout === 'home'" class="VPFooter">
        <div class="container">
          <p class="message">message.</p>
          <p class="copyright">&copy; {{ new Date().getFullYear() }} mazecate. All Rights Reserved.</p>
        </div>
      </footer>
    </template>
  </Layout> -->
</template>

<style scoped>
/* .VPFooter {
  position: relative;
  z-index: 14;
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-gutter);
  transition: border-color 0.5s, background-color 0.5s;
}

.VPFooter .container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width, 1440px);
  text-align: center;
}

.VPFooter .message,
.VPFooter .copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.VPFooter .message {
  margin-bottom: 4px;
}

@media (min-width: 768px) {
  .VPFooter {
    padding: 32px 32px;
  }
} */
</style>