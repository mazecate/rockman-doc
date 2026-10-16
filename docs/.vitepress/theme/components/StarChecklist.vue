<script setup lang="ts">
import type { GameStarsData } from '../types'

defineProps<{
  gameData: GameStarsData
}>()

const isClassicExe = (series: string) => ['exe1', 'exe2', 'exe3'].includes(series)
const isStarForce = (series: string) => ['sf1', 'sf2', 'sf3'].includes(series)
</script>

<template>
  <div class="star-checklist" v-if="gameData">
    <div v-if="gameData.bannerImage" class="banner-image-container">
      <img :src="gameData.bannerImage" :alt="gameData.title" class="imgW" />
    </div>

    <div class="boss-banner" v-if="gameData.ultimateNote">
      <div class="banner-body">
        <div class="banner-icon">⚡</div>
        <div class="banner-content">
          <span class="banner-title">最終頭目與通關機制</span>
          <p>{{ gameData.ultimateNote }}</p>
        </div>
      </div>
    </div>

    <div class="star-grid">
      <div 
        v-for="item in gameData.stars" 
        :key="item.id" 
        class="star-card"
      >
        <div class="star-identity">
          <div class="icon-frame" :style="{ '--item-color': item.color || '#3eaf7c' }">

            <img 
              v-if="item.image" 
              :src="item.image" 
              :alt="item.name" 
              class="custom-mark-img" 
            />
            <!-- EXE 1 ~ 3：星星 -->
            <svg 
              v-else-if="isClassicExe(gameData.series)" 
              class="symbol-icon star" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <!-- 流星系列 SF1 ~ SF3：電波 -->
            <svg 
              v-else-if="isStarForce(gameData.series)" 
              class="symbol-icon wave" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <!-- EXE 4 ~ 6：徽章 -->
            <svg 
              v-else 
              class="symbol-icon emblem" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 13.8c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z"/>
            </svg>
          </div>
          <span class="star-name">{{ item.name }}</span>
        </div>

        <div class="star-details">
          <p class="condition">{{ item.condition }}</p>
          <div v-if="item.extra" class="command-tag">
            <span class="command-label">指令</span>
            <code>{{ item.extra }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.star-checklist {
  margin: 1.5rem 0;
  font-family: var(--vp-font-family-base);
}

/* Banner 圖片外層容器 */
.banner-image-container {
  margin-bottom: 1rem;
}

/* 最終頭目與機制卡片 */
.boss-banner {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.boss-banner:hover {
  border-color: var(--vp-c-brand-1);
}

.banner-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
}

.banner-icon {
  font-size: 1.2rem;
  line-height: 1.4;
}

.banner-title {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  display: block;
  margin-bottom: 2px;
}

.banner-content p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* 清單網格 */
.star-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.star-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.star-card:hover {
  border-color: var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  transform: translateX(2px);
}

.star-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
  flex-shrink: 0;
}

.icon-frame {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--item-color);
  flex-shrink: 0;
}

.custom-mark-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.symbol-icon {
  width: 20px;
  height: 20px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.15));
}

.star-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.star-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.condition {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.command-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.command-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.command-tag code {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 640px) {
  .star-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 14px;
  }
}

@media (max-width: 767px) {
  .command-tag {
    flex-direction: column;
    align-items: start;
  }
}
</style>