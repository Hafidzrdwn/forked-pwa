<script setup lang="ts">
withDefaults(
  defineProps<{
    class?: string
  }>(),
  {
    class: ''
  }
)
</script>

<template>
  <div
    :class="[
      'pointer-events-none select-none transition-opacity duration-300',
      $props.class
    ]"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 340 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full overflow-visible"
    >
      <defs>
        <!-- Gradients for subtle depth -->
        <linearGradient id="navPathGrad" x1="160" y1="170" x2="160" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.9" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.2" />
        </linearGradient>

        <linearGradient id="charCoatGrad" x1="158" y1="100" x2="140" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.35" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.1" />
        </linearGradient>

        <radialGradient id="compassGlow" cx="120" cy="116" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.4" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </radialGradient>

        <radialGradient id="hillGlow" cx="160" cy="210" r="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.15" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Ambient Ground Mound & Hill Silhouette -->
      <ellipse cx="160" cy="215" rx="150" ry="26" fill="url(#hillGlow)" />
      <path
        d="M10 240C45 210 100 188 160 188C220 188 275 210 330 240"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        opacity="0.5"
      />

      <!-- Forked Crossroads Paths (Left Fork, Center Fork, Right Fork) -->
      <!-- Left Fork Road -->
      <path
        d="M148 190C122 192 78 206 32 240"
        stroke="url(#navPathGrad)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M142 192C118 196 82 210 44 240"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-dasharray="3 5"
        opacity="0.6"
      />

      <!-- Right Fork Road -->
      <path
        d="M172 190C198 192 242 206 288 240"
        stroke="url(#navPathGrad)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M178 192C202 196 238 210 276 240"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-dasharray="3 5"
        opacity="0.6"
      />

      <!-- Center Road into the Horizon -->
      <path
        d="M160 190V235"
        stroke="url(#navPathGrad)"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.4"
      />

      <!-- Cosmic / Guiding Sky Orbits & Constellations -->
      <path
        d="M25 155A190 190 0 0 1 315 125"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-dasharray="6 8"
        opacity="0.3"
      />
      <path
        d="M60 115A170 170 0 0 1 290 85"
        stroke="currentColor"
        stroke-width="1"
        stroke-dasharray="4 6"
        opacity="0.25"
      />

      <!-- Constellation Nodes & Connecting Rays (Upper Right Sky) -->
      <path d="M216 78L252 46L288 72" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" opacity="0.4" />
      <path d="M252 46L268 28" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.35" />

      <!-- Guiding Star 1 (Polaris / North Star Zenith) -->
      <g transform="translate(252, 46)">
        <circle cx="0" cy="0" r="10" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
        <path d="M0 -7V7M-7 0H7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <circle cx="0" cy="0" r="2.5" fill="currentColor" />
      </g>

      <!-- Guiding Star 2 -->
      <g transform="translate(216, 78)">
        <path d="M0 -5V5M-5 0H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="2" fill="currentColor" />
      </g>

      <!-- Guiding Star 3 -->
      <g transform="translate(288, 72)">
        <path d="M0 -5V5M-5 0H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="2" fill="currentColor" />
      </g>

      <!-- North Compass Rose Watermark (Top Right) -->
      <g transform="translate(300, 36)" opacity="0.65">
        <circle cx="0" cy="0" r="14" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3" />
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="currentColor" opacity="0.4" />
        <polygon points="0,-12 3,-3 0,0 -3,-3" fill="currentColor" />
      </g>

      <!-- Wind / Decision Drift Streamlines -->
      <path d="M65 140C95 135 125 142 155 138" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
      <path d="M85 152C110 148 135 154 160 150" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.25" />
      <path d="M190 148C215 144 245 150 275 146" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />

      <!-- ======================================================== -->
      <!-- THE CHARACTER: THE DECISION NAVIGATOR                   -->
      <!-- ======================================================== -->

      <!-- Subtle Aura around character's compass/hand -->
      <circle cx="124" cy="120" r="24" fill="url(#compassGlow)" />

      <!-- Flowing Coat / Trenchcoat Tails (Back Layer) -->
      <path
        d="M152 128C142 142 132 160 135 174C140 176 150 172 154 162L156 132Z"
        fill="url(#charCoatGrad)"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Legs & Stance (Standing firmly at the fork apex) -->
      <!-- Left Leg & Boot -->
      <path
        d="M154 150L150 188H144C143 190 144 192 148 192H156L158 150"
        fill="currentColor"
        fill-opacity="0.18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Right Leg & Boot (slightly forward) -->
      <path
        d="M165 150L170 188H165C164 190 166 192 170 192H178L172 150"
        fill="currentColor"
        fill-opacity="0.22"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Torso & Explorer Jacket -->
      <path
        d="M152 114L151 150H167L167 114C167 112 153 112 152 114Z"
        fill="currentColor"
        fill-opacity="0.15"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Belt & Buckle -->
      <path d="M151 146H167" stroke="currentColor" stroke-width="2" />
      <rect x="156.5" y="144" width="5" height="4" rx="1" fill="currentColor" opacity="0.8" />

      <!-- Scarf / Lapel caught in breeze -->
      <path
        d="M154 114C150 118 144 122 138 123C134 123 135 120 140 118L156 112"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="currentColor"
        fill-opacity="0.2"
      />

      <!-- Left Arm: Raised holding the Navigational Compass / Astrolabe -->
      <path
        d="M152 116L138 126L126 122"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Hand -->
      <circle cx="124" cy="122" r="3" fill="currentColor" />

      <!-- Glowing Pocket Compass / Astrolabe in Hand -->
      <circle cx="120" cy="118" r="9" stroke="currentColor" stroke-width="1.8" />
      <circle cx="120" cy="118" r="5" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" opacity="0.8" />
      <polygon points="120,111 122,118 120,121 118,118" fill="currentColor" />
      <!-- Astrolabe Top Ring -->
      <circle cx="120" cy="107.5" r="2" stroke="currentColor" stroke-width="1" />

      <!-- Right Arm: Confident gesture towards the forward horizons -->
      <path
        d="M166 116L176 128L186 125"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Right Hand pointing/holding strap -->
      <circle cx="188" cy="124" r="2.8" fill="currentColor" />

      <!-- Neck & Head Profile (Looking toward horizon/right) -->
      <path d="M158 106V112" stroke="currentColor" stroke-width="2" />

      <!-- Head Silhouette -->
      <path
        d="M158 105C163 105 167 101 167 96C167 90 162 86 157 86C152 86 148 90 148 96C148 101 152 105 158 105Z"
        fill="currentColor"
        fill-opacity="0.2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />

      <!-- Stylish Hair (Windblown to Left) -->
      <path
        d="M148 93C143 91 138 95 133 93C137 88 143 86 148 86C153 82 163 82 167 86C169 88 170 91 169 93C165 92 160 90 156 93"
        fill="currentColor"
        fill-opacity="0.6"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Face Profile Detail (Brows & Gaze to Horizon) -->
      <path d="M164 94H167L165 98" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.8" />

      <!-- Ground Crossroads Marker Stone / Milestone (At foot of path) -->
      <g transform="translate(196, 184)" opacity="0.65">
        <rect x="0" y="0" width="8" height="13" rx="2" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity="0.2" />
        <line x1="2" y1="4" x2="6" y2="4" stroke="currentColor" stroke-width="1" />
        <line x1="2" y1="7" x2="5" y2="7" stroke="currentColor" stroke-width="1" />
      </g>
    </svg>
  </div>
</template>
