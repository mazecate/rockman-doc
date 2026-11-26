<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
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
const hasPreloaded = ref(false)
const hasError = ref(false)

const resolvedSrc = computed(() => {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return ''
  }
  return withBase(src)
})

const hasValidImage = computed(() => {
  return resolvedSrc.value.length > 0
})

// --- Hover 偷偷 Load：只 load 一次，唔會重複 ---
const preloadImage = () => {
  if (!hasValidImage.value || hasPreloaded.value) return
  // SSR 時唔好執行
  if (typeof window === 'undefined') return
  hasPreloaded.value = true
  const img = new Image()
  img.src = resolvedSrc.value
  // 預載失敗都唔好阻住之後開 popup，正式 img 會再試一次
  img.onerror = () => {
    hasPreloaded.value = false
  }
}

const handleOpen = () => {
  if (hasValidImage.value) {
    // 手機 / 鍵盤冇 hover，click 嗰下都順便 preload 一次
    preloadImage()
    isOpen.value = true
  }
}

const handleClose = () => {
  isOpen.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

// 監聽 isOpen 狀態，當彈窗打開時鎖定 body 捲動，關閉時解鎖 + 加 Esc 關閉
watch(isOpen, (val) => {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('overflow-hidden', val)
    if (val) {
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
    document.body.classList.remove('overflow-hidden')
  }
})
</script>

<template>
  <!-- 點擊觸發的文字 -->
  <span
    :class="{ 'click-text': hasValidImage }"
    @click="handleOpen"
    @mouseenter="preloadImage"
    @focus="preloadImage"
    @touchstart.passive="preloadImage"
    tabindex="0"
    role="button"
    :aria-label="`開啟圖片：${alt}`"
    @keydown.enter="handleOpen"
    @keydown.space.prevent="handleOpen"
  >
    <slot></slot>
  </span>

  <!-- 使用 Teleport 將彈窗直接傳送至 body，確保絕對是 Full Page 覆蓋 -->
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="hasValidImage && isOpen"
        class="image-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="alt"
        @click="handleClose"
      >
        <div class="image-wrapper" @click.stop>
          <img
            v-if="!hasError"
            :src="resolvedSrc"
            :alt="alt"
            class="popup-img"
            loading="eager"
            decoding="async"
            @error="hasError = true"
          />
          <div v-else class="error-msg">圖片載入失敗</div>
          <button class="close-btn" aria-label="關閉圖片" @click="handleClose">×</button>
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
.click-text:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
  border-radius: 2px;
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
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-img {
  display: block;
  width: auto;
  height: auto;
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.error-msg {
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  padding: 16px 24px;
  border-radius: 8px;
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
  .image-wrapper {
    max-width: 92vw;
  }
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
