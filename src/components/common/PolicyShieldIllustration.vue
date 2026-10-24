<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'privacy' | 'terms'
    className?: string
  }>(),
  {
    variant: 'privacy',
    className: ''
  }
)
</script>

<template>
  <div :class="['relative pointer-events-none select-none flex items-center justify-center', className]" aria-hidden="true">
    <!-- SVG Vector Illustration -->
    <svg
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto drop-shadow-xs"
    >
      <defs>
        <!-- Subtle Theme Gradients -->
        <linearGradient id="shieldGradPrimary" x1="40" y1="20" x2="240" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.22" />
          <stop offset="50%" stop-color="var(--color-primary)" stop-opacity="0.08" />
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.02" />
        </linearGradient>

        <linearGradient id="shieldGradBorder" x1="60" y1="30" x2="220" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.6" />
          <stop offset="50%" stop-color="var(--color-border)" stop-opacity="0.4" />
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.2" />
        </linearGradient>

        <linearGradient id="coreGlow" x1="140" y1="80" x2="140" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="shieldAccent" x1="100" y1="70" x2="180" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.8" />
          <stop offset="100%" stop-color="var(--color-primary-dark)" stop-opacity="0.6" />
        </linearGradient>
      </defs>

      <!-- Background Ambient Aura -->
      <circle cx="140" cy="120" r="85" fill="url(#coreGlow)" />
      
      <!-- Outer Geometric Constellation Ring -->
      <circle cx="140" cy="120" r="95" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="3 6" opacity="0.6" />
      <circle cx="140" cy="120" r="110" stroke="var(--color-border)" stroke-width="0.8" stroke-dasharray="1 9" opacity="0.4" />

      <!-- Orbit Nodes -->
      <circle cx="140" cy="25" r="3.5" fill="var(--color-primary)" opacity="0.8" />
      <circle cx="235" cy="120" r="3" fill="var(--color-border-hover)" />
      <circle cx="140" cy="215" r="3.5" fill="var(--color-primary)" opacity="0.8" />
      <circle cx="45" cy="120" r="3" fill="var(--color-border-hover)" />
      <circle cx="207" cy="53" r="2" fill="var(--color-primary)" opacity="0.6" />
      <circle cx="73" cy="187" r="2" fill="var(--color-primary)" opacity="0.6" />

      <!-- Center Heraldic Minimalist Shield -->
      <path
        d="M140 45 L200 68 C200 128 172 175 140 196 C108 175 80 128 80 68 Z"
        fill="url(#shieldGradPrimary)"
        stroke="url(#shieldGradBorder)"
        stroke-width="2"
        stroke-linejoin="round"
      />

      <!-- Inner Concentric Boundary -->
      <path
        d="M140 58 L188 77 C188 123 166 161 140 179 C114 161 92 123 92 77 Z"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="1"
        stroke-opacity="0.25"
        stroke-dasharray="4 3"
      />

      <!-- VARIANT A: Privacy (Lock + Local Keyhole + Radiating Waves) -->
      <g v-if="variant === 'privacy'">
        <!-- Lock Body Outline -->
        <rect
          x="120"
          y="108"
          width="40"
          height="32"
          rx="8"
          fill="var(--color-surface)"
          stroke="var(--color-primary)"
          stroke-width="2.2"
        />

        <!-- Shackle -->
        <path
          d="M127 108 V95 C127 87.8 132.8 82 140 82 C147.2 82 153 87.8 153 95 V108"
          stroke="var(--color-primary)"
          stroke-width="2.5"
          stroke-linecap="round"
        />

        <!-- Keyhole Core -->
        <circle cx="140" cy="120" r="3.5" fill="var(--color-primary)" />
        <path d="M138.5 122 L137 131 H143 L141.5 122 Z" fill="var(--color-primary)" />

        <!-- Checkmark badge at shield bottom -->
        <circle cx="140" cy="168" r="9" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.8" />
        <polyline points="136 168 139 171 145 165" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Guarding Data Streams -->
        <path d="M60 85 Q75 110 65 140" stroke="var(--color-primary)" stroke-width="1.2" stroke-linecap="round" opacity="0.3" stroke-dasharray="2 4" />
        <path d="M220 85 Q205 110 215 140" stroke="var(--color-primary)" stroke-width="1.2" stroke-linecap="round" opacity="0.3" stroke-dasharray="2 4" />
      </g>

      <!-- VARIANT B: Terms (Balanced Scales of Justice & Transparent Compass) -->
      <g v-else>
        <!-- Center Pillar of Balance -->
        <line x1="140" y1="80" x2="140" y2="155" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="140" cy="80" r="4" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="2" />
        <line x1="130" y1="155" x2="150" y2="155" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" />

        <!-- Crossbeam -->
        <line x1="112" y1="92" x2="168" y2="92" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" />

        <!-- Left Scale Pan -->
        <line x1="112" y1="92" x2="104" y2="114" stroke="var(--color-fg-muted)" stroke-width="1.2" />
        <line x1="112" y1="92" x2="120" y2="114" stroke="var(--color-fg-muted)" stroke-width="1.2" />
        <path d="M100 114 Q112 124 124 114 Z" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5" />

        <!-- Right Scale Pan -->
        <line x1="168" y1="92" x2="160" y2="114" stroke="var(--color-fg-muted)" stroke-width="1.2" />
        <line x1="168" y1="92" x2="176" y2="114" stroke="var(--color-fg-muted)" stroke-width="1.2" />
        <path d="M156 114 Q168 124 180 114 Z" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5" />

        <!-- Guiding North Star at bottom -->
        <polygon
          points="140 162 142 168 148 170 142 172 140 178 138 172 132 170 138 168"
          fill="var(--color-primary)"
          opacity="0.85"
        />
      </g>

      <!-- Tiny Guiding Sparkles -->
      <polygon points="196 90 197.5 94 201.5 95.5 197.5 97 196 101 194.5 97 190.5 95.5 194.5 94" fill="var(--color-primary)" opacity="0.6" />
      <polygon points="84 140 85 143 88 144 85 145 84 148 83 145 80 144 83 143" fill="var(--color-primary)" opacity="0.6" />
    </svg>
  </div>
</template>
