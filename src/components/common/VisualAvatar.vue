<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    name?: string
  }>(),
  {
    size: 32,
    name: 'User'
  }
)
</script>

<template>
  <div
    class="visual-avatar-wrapper"
    :style="{ width: size + 'px', height: size + 'px' }"
    :title="name"
    role="img"
    :aria-label="name + ' profile avatar'"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="avatar-svg"
    >
      <defs>
        <linearGradient id="avatarBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#eaf3ec" />
          <stop offset="100%" stop-color="#cbe2d1" />
        </linearGradient>

        <radialGradient id="faceGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#ffe6d4" />
          <stop offset="70%" stop-color="#ffd1b5" />
          <stop offset="100%" stop-color="#e8af8f" />
        </radialGradient>

        <linearGradient id="hairGrad" x1="20" y1="15" x2="80" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3b4d3f" />
          <stop offset="100%" stop-color="#19281c" />
        </linearGradient>

        <linearGradient id="glassesGrad" x1="25" y1="45" x2="75" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2c6643" />
          <stop offset="100%" stop-color="#1a452c" />
        </linearGradient>

        <linearGradient id="hoodieGrad" x1="20" y1="75" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2c6845" />
          <stop offset="100%" stop-color="#1b422b" />
        </linearGradient>

        <filter id="softAvatarShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#143621" flood-opacity="0.12" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="48" fill="url(#avatarBg)" stroke="#cbe0d1" stroke-width="2" filter="url(#softAvatarShadow)" />

      <path
        d="M20 95C22 78 35 73 50 73C65 73 78 78 80 95C68 98 32 98 20 95Z"
        fill="url(#hoodieGrad)"
      />
      <path d="M42 74C42 79 58 79 58 74" stroke="#ffe2d0" stroke-width="2" stroke-linecap="round" />

      <rect x="43" y="62" width="14" height="15" rx="5" fill="#f0b89b" />

      <ellipse cx="50" cy="48" rx="22" ry="24" fill="url(#faceGrad)" />

      <circle cx="37" cy="55" r="4" fill="#f79c8d" opacity="0.45" />
      <circle cx="63" cy="55" r="4" fill="#f79c8d" opacity="0.45" />

      <ellipse cx="40" cy="47" rx="2.2" ry="3" fill="#1d2b20" />
      <ellipse cx="60" cy="47" rx="2.2" ry="3" fill="#1d2b20" />
      <circle cx="41" cy="46" r="0.9" fill="#ffffff" />
      <circle cx="61" cy="46" r="0.9" fill="#ffffff" />

      <circle cx="39" cy="48" r="9" stroke="url(#glassesGrad)" stroke-width="2.6" fill="rgba(255,255,255,0.2)" />
      <circle cx="61" cy="48" r="9" stroke="url(#glassesGrad)" stroke-width="2.6" fill="rgba(255,255,255,0.2)" />
      <path d="M48 48H52" stroke="url(#glassesGrad)" stroke-width="2.6" stroke-linecap="round" />

      <path d="M46 59C48 61.5 52 61.5 54 59" stroke="#965239" stroke-width="2" stroke-linecap="round" fill="none" />

      <path
        d="M28 42C26 27 34 20 50 19C66 18 73 26 73 38C73 43 70 47 67 49C66 43 65 37 60 36C52 35 48 37 40 37C34 37 30 39 28 42Z"
        fill="url(#hairGrad)"
      />
      <path d="M37 23C45 21 54 22 59 25" stroke="#5d7863" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped>
.visual-avatar-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.visual-avatar-wrapper:hover {
  transform: scale(1.08) rotate(-2deg);
}
.avatar-svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
