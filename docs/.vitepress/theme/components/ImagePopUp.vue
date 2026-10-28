<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
// import { getImagePath, getDataObjectImagePath } from '@/theme/utils/imghelper'

const {
  src = null,
  alt = '圖片'
} = defineProps<{
  src?: string | null
  alt?: string
}>()

const isOpen = ref(false)

const resolvedSrc = computed(() => {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return ''
  }
  return withBase(src)
})

const hasValidImage = computed(() => {
  return resolvedSrc.value.length > 0
})

const handleOpen = () => {
  if (hasValidImage.value) {
    isOpen.value = true
  }
}
</script>

<template>
  <!-- 點擊觸發的文字 -->
  <span 
    :class="{ 'click-text': hasValidImage }" 
    @click="handleOpen"
  >
    <slot></slot>
  </span>

  <!-- 使用 Teleport 將彈窗直接傳送至 body，確保絕對是 Full Page 覆蓋 -->
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="hasValidImage && isOpen" class="image-overlay" @click="isOpen = false">
        <div class="image-wrapper" @click.stop>
          <img :src="resolvedSrc" :alt="alt" class="popup-img" />
          <!-- <img :src="src" :alt="alt" class="popup-img" /> -->
          <button class="close-btn" @click="isOpen = false">×</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.click-text {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}
.click-text:hover {
  color: var(--vp-c-brand-2);
}

/* 遮罩背景：固定在視窗最上層 */
.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 確保層級高過 VitePress 的 Navbar / Sidebar */
}

.image-wrapper {
  position: relative;
  max-width: 85%;
  max-height: 85%;
}

.popup-img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 35px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .close-btn {
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
  }
}

/* ===========================
   動畫樣式 (Transition Animations)
   ================----------- */

/* 1. 遮罩背景的淡入淡出 (Fade) */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* 2. 圖片內容的縮放與淡入 (Scale & Fade) */
.overlay-fade-enter-active .image-wrapper {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.overlay-fade-leave-active .image-wrapper {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.overlay-fade-enter-from .image-wrapper,
.overlay-fade-leave-to .image-wrapper {
  opacity: 0;
  transform: scale(0.92); /* 彈窗開啟時由稍微縮小放大到 100% */
}
</style>