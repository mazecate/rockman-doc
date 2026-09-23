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
</template>