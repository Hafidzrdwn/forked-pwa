<script setup lang="ts">
withDefaults(
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
  <div class="brand-container" :style="{ '--logo-size': size + 'px' }">
    <!-- Wonderful Custom SVG Logo for Forked: Deliberate Branching Path -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="forked-svg-mark"
      role="img"
      aria-label="Forked decision logo"
    >
      <defs>
        <!-- Rich emerald gradient -->
        <linearGradient id="forkGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#347852" />
          <stop offset="50%" stop-color="#245d3e" />
          <stop offset="100%" stop-color="#143b27" />
        </linearGradient>
        <!-- Soft path accent glow -->
        <linearGradient id="accentGlow" x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#55ad76" />
          <stop offset="100%" stop-color="#a4dcba" />
        </linearGradient>
        <filter id="subtleShadow" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#133522" flood-opacity="0.25" />
        </filter>
      </defs>

      <!-- Rounded Squircle Badge Base -->
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="14"
        fill="url(#forkGrad)"
        filter="url(#subtleShadow)"
      />

      <!-- Branching Fork Paths -->
      <!-- Left Path: Curved branch branching outward and up -->
      <path
        d="M24 38V25C24 20 15 19 15 13V9"
        stroke="#FFFFFF"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Right Path: Growth branch with vibrant node -->
      <path
        d="M24 27C24 20 33 19 33 13V9"
        stroke="#A7DEC0"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Crossroads Decision Point (Pulse circle at bifurcation) -->
      <circle cx="24" cy="27" r="3.2" fill="#FFFFFF" />
      <circle cx="24" cy="27" r="1.4" fill="#245d3e" />

      <!-- Left Path Terminus: Grounded Choice -->
      <circle cx="15" cy="9" r="3" fill="#FFFFFF" />

      <!-- Right Path Terminus: Growth Choice (Arrow / Diamond Head) -->
      <circle cx="33" cy="9" r="3.2" fill="#A7DEC0" />
      <circle cx="33" cy="9" r="1.5" fill="#143b27" />

      <!-- Root anchor dot at bottom -->
      <circle cx="24" cy="38" r="2.2" fill="#A7DEC0" />
    </svg>

    <div v-if="showWordmark" class="brand-text">
      <span class="brand-title">forked<span class="brand-dot">.</span></span>
      <small v-if="subtitle" class="brand-subtitle">{{ subtitle }}</small>
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
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 23px;
  letter-spacing: -1.1px;
  line-height: 1;
  color: var(--ink);
}
.brand-dot {
  color: #3b8b5a;
}
.brand-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #92998f;
  margin-top: 4px;
}
</style>
