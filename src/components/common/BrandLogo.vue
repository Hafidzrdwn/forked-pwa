<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number
    showWordmark?: boolean
    subtitle?: string
  }>(),
  {
    size: 36,
    showWordmark: true,
    subtitle: 'STUDIO KEPUTUSAN'
  }
)
</script>

<template>
  <div class="brand-container" :style="{ '--logo-size': (props.size ?? 36) + 'px' }">
    <svg
      :width="props.size ?? 36"
      :height="props.size ?? 36"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="forked-svg-mark"
      role="img"
      aria-label="Forked decision logo"
    >
      <defs>
        <linearGradient id="forkGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#347852" />
          <stop offset="50%" stop-color="#245d3e" />
          <stop offset="100%" stop-color="#143b27" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#55ad76" />
          <stop offset="100%" stop-color="#a4dcba" />
        </linearGradient>
        <filter id="subtleShadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#133522" flood-opacity="0.25" />
        </filter>
      </defs>

      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="14"
        fill="url(#forkGrad)"
        filter="url(#subtleShadow)"
      />

      <path
        d="M24 38V25C24 20 15 19 15 13V9"
        stroke="#FFFFFF"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M24 27C24 20 33 19 33 13V9"
        stroke="#A7DEC0"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <circle cx="24" cy="27" r="3.2" fill="#FFFFFF" />
      <circle cx="24" cy="27" r="1.4" fill="#245d3e" />

      <circle cx="15" cy="9" r="3" fill="#FFFFFF" />

      <circle cx="33" cy="9" r="3.2" fill="#A7DEC0" />
      <circle cx="33" cy="9" r="1.5" fill="#143b27" />

      <circle cx="24" cy="38" r="2.2" fill="#A7DEC0" />
    </svg>

    <div v-if="props.showWordmark" class="brand-text">
      <span class="brand-title">forked<span class="brand-dot">.</span></span>
      <small v-if="props.subtitle" class="brand-subtitle">{{ props.subtitle }}</small>
    </div>
  </div>
</template>

<style scoped>
.brand-container {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  user-select: none;
}
.forked-svg-mark {
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.brand-container:hover .forked-svg-mark {
  transform: scale(1.05) rotate(-2deg);
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-title {
  font-family: var(--font-display, sans-serif);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-fg);
  line-height: 1;
}
.brand-dot {
  color: var(--color-primary);
}
.brand-subtitle {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--color-fg-muted);
  text-transform: uppercase;
  margin-top: 3px;
}
</style>
