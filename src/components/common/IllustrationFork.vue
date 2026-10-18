<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number
    height?: number
  }>(),
  {
    width: 140,
    height: 120
  }
)
</script>

<template>
  <div class="illustration-container" :style="{ width: width + 'px', height: height + 'px' }">
    <svg
      :width="width"
      :height="height"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="illustration-svg"
      role="img"
      aria-label="Crossroads decision illustration"
    >
      <defs>
        <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#eaf3ec" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#f8f9f6" stop-opacity="0" />
        </radialGradient>

        <linearGradient id="pathLeft" x1="100" y1="140" x2="45" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#3d8258" />
          <stop offset="100%" stop-color="#73ab87" />
        </linearGradient>

        <linearGradient id="pathRight" x1="100" y1="140" x2="155" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2c6943" />
          <stop offset="100%" stop-color="#469363" />
        </linearGradient>

        <linearGradient id="cardGrad1" x1="0" y1="0" x2="60" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f1f6f2" />
        </linearGradient>

        <filter id="floatShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#183d26" flood-opacity="0.1" />
        </filter>
      </defs>

      <ellipse cx="100" cy="135" rx="75" ry="18" fill="url(#groundGlow)" />

      <path
        d="M93 148C95 125 97 115 100 105C103 115 105 125 107 148Z"
        fill="#265a3b"
        opacity="0.25"
      />

      <path
        d="M100 105C94 92 72 82 50 68"
        stroke="url(#pathLeft)"
        stroke-width="12"
        stroke-linecap="round"
      />
      <path
        d="M95 102C90 92 72 83 55 72"
        stroke="#ffffff"
        stroke-width="2.5"
        stroke-dasharray="4 5"
        stroke-linecap="round"
      />

      <path
        d="M100 105C106 92 128 82 150 68"
        stroke="url(#pathRight)"
        stroke-width="12"
        stroke-linecap="round"
      />
      <path
        d="M105 102C110 92 128 83 145 72"
        stroke="#ffffff"
        stroke-width="2.5"
        stroke-dasharray="4 5"
        stroke-linecap="round"
      />

      <ellipse cx="100" cy="107" rx="16" ry="9" fill="#1b462c" />
      <ellipse cx="100" cy="105" rx="14" ry="7.5" fill="#387a52" />
      <ellipse cx="100" cy="104" rx="8" ry="4" fill="#a4daba" />

      <g filter="url(#floatShadow)">
        <rect x="25" y="32" width="52" height="34" rx="9" fill="url(#cardGrad1)" stroke="#d9e6dc" stroke-width="1.5" />
        <circle cx="37" cy="44" r="4.5" fill="#eaf4ec" />
        <path d="M35 44L36.5 45.5L39.5 42.5" stroke="#316e45" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="45" y="41" width="22" height="3" rx="1.5" fill="#2d643f" />
        <rect x="45" y="47" width="16" height="2.5" rx="1" fill="#9cb4a2" />
        <rect x="33" y="55" width="36" height="2" rx="1" fill="#e5ece6" />
      </g>

      <g filter="url(#floatShadow)">
        <rect x="123" y="32" width="52" height="34" rx="9" fill="url(#cardGrad1)" stroke="#d9e6dc" stroke-width="1.5" />
        <circle cx="135" cy="44" r="4.5" fill="#fdf3e2" />
        <circle cx="135" cy="44" r="2" fill="#c48a31" />
        <rect x="143" y="41" width="22" height="3" rx="1.5" fill="#966d29" />
        <rect x="143" y="47" width="16" height="2.5" rx="1" fill="#bfae93" />
        <rect x="131" y="55" width="36" height="2" rx="1" fill="#e5ece6" />
      </g>

      <path d="M100 24L101.5 28L105.5 29.5L101.5 31L100 35L98.5 31L94.5 29.5L98.5 28Z" fill="#3f8f5e" />
      <path d="M15 85L16 88L19 89L16 90L15 93L14 90L11 89L14 88Z" fill="#a4dcba" />
      <path d="M185 85L186 88L189 89L186 90L185 93L184 90L181 89L184 88Z" fill="#a4dcba" />
    </svg>
  </div>
</template>

<style scoped>
.illustration-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  animation: floatSubtle 4s ease-in-out infinite alternate;
}
.illustration-svg {
  width: 100%;
  height: 100%;
}
@keyframes floatSubtle {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-4px); }
}
</style>
