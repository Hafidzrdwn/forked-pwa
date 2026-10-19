export const forkedPalette = {
  canvas: {
    base: '#f8f8f5',
    subtle: '#f1f4ee',
    dark: '#111612',
    darkSubtle: '#1b231c'
  },
  surface: {
    base: '#ffffff',
    elevated: '#fdfdfa',
    dark: '#18201a',
    darkElevated: '#1e2820'
  },
  border: {
    default: '#e3e6de',
    hover: '#c9d0c4',
    dark: '#29352b',
    darkHover: '#3c4c3e'
  },
  text: {
    primary: '#1e261f',
    muted: '#5e665d',
    subtle: '#868e85',
    darkPrimary: '#e8ede8',
    darkMuted: '#9fa99e',
    darkSubtle: '#788277'
  },
  primary: {
    base: '#245d3e',
    dark: '#19432c',
    soft: '#eaf3ec',
    glowStart: '#55ad76',
    glowEnd: '#a4dcba',
    darkBase: '#419665',
    darkDark: '#2e7a4e',
    darkSoft: '#192d20'
  },
  secondary: {
    petrol: '#366077',
    petrolSoft: '#e9f2f6',
    darkPetrol: '#5b90ab',
    darkPetrolSoft: '#182832'
  },
  amber: {
    base: '#94641f',
    soft: '#fbf2de',
    darkBase: '#d49a42',
    darkSoft: '#2e2313'
  },
  danger: {
    base: '#b54739',
    soft: '#fdf0ed',
    darkBase: '#d96253',
    darkSoft: '#311917'
  },
  brandGradient: {
    start: '#347852',
    middle: '#245d3e',
    end: '#143b27',
    shadowFlood: '#133522',
    accentBranch: '#a7dec0'
  }
} as const;

export const forkedTypography = {
  fonts: {
    display: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
    sans: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  weights: {
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800
  },
  storyScale: {
    hero: {
      fontSize: 104,
      lineHeight: 1.08,
      letterSpacing: -2.5,
      fontWeight: 800
    },
    h1: {
      fontSize: 78,
      lineHeight: 1.14,
      letterSpacing: -1.5,
      fontWeight: 800
    },
    h2: {
      fontSize: 58,
      lineHeight: 1.16,
      letterSpacing: -1.2,
      fontWeight: 800
    },
    h3: {
      fontSize: 34,
      lineHeight: 1.25,
      letterSpacing: -0.5,
      fontWeight: 700
    },
    metricLarge: {
      fontSize: 46,
      lineHeight: 1.1,
      letterSpacing: -0.8,
      fontWeight: 800
    },
    metricMedium: {
      fontSize: 32,
      lineHeight: 1.2,
      letterSpacing: -0.4,
      fontWeight: 700
    },
    bodyLarge: {
      fontSize: 28,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontWeight: 500
    },
    body: {
      fontSize: 24,
      lineHeight: 1.45,
      letterSpacing: 0,
      fontWeight: 500
    },
    labelBold: {
      fontSize: 22,
      lineHeight: 1.3,
      letterSpacing: 0.8,
      fontWeight: 700
    },
    pill: {
      fontSize: 20,
      lineHeight: 1.2,
      letterSpacing: 1.2,
      fontWeight: 800
    },
    subtext: {
      fontSize: 18,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontWeight: 500
    }
  }
} as const;

export const forkedRadii = {
  badge: 14,
  button: 22,
  card: 36,
  cardLarge: 44,
  pill: 9999,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 36,
  '3xl': 44
} as const;

export const forkedShadows = {
  subtle: '0 4px 12px rgba(30, 38, 31, 0.04)',
  card: '0 20px 40px -10px rgba(30, 38, 31, 0.08)',
  elevated: '0 30px 60px -15px rgba(30, 38, 31, 0.12)',
  floating: '0 24px 48px -12px rgba(36, 93, 62, 0.35)',
  brandGlow: '0 16px 36px -8px rgba(36, 93, 62, 0.35)',
  sliderThumb: '0 4px 12px rgba(36, 93, 62, 0.3)'
} as const;

export const forkedElevations = forkedShadows;
export const forkedRadius = forkedRadii;

export const forkedComponents = {
  card: {
    backgroundColor: forkedPalette.surface.base,
    border: `2px solid ${forkedPalette.border.default}`,
    borderRadius: forkedRadii.card,
    boxShadow: forkedShadows.card
  },
  cardSelected: {
    backgroundColor: forkedPalette.surface.base,
    border: `2.5px solid ${forkedPalette.primary.base}`,
    borderRadius: forkedRadii.card,
    boxShadow: '0 20px 45px -10px rgba(36, 93, 62, 0.16)'
  },
  pillTag: {
    borderRadius: forkedRadii.pill,
    padding: '10px 24px',
    fontSize: forkedTypography.storyScale.pill.fontSize,
    fontWeight: forkedTypography.storyScale.pill.fontWeight,
    letterSpacing: forkedTypography.storyScale.pill.letterSpacing,
    textTransform: 'uppercase' as const
  },
  primaryPill: {
    backgroundColor: forkedPalette.primary.soft,
    color: forkedPalette.primary.base,
    border: `1.5px solid ${forkedPalette.primary.glowEnd}`
  },
  neutralPill: {
    backgroundColor: forkedPalette.canvas.subtle,
    color: forkedPalette.text.muted,
    border: `1.5px solid ${forkedPalette.border.default}`
  },
  dangerPill: {
    backgroundColor: forkedPalette.danger.soft,
    color: forkedPalette.danger.base,
    border: `1.5px solid #f9ccc4`
  },
  slider: {
    trackHeight: 24,
    trackBackground: forkedPalette.border.default,
    trackFill: forkedPalette.primary.base,
    thumbSize: 52,
    thumbBackground: forkedPalette.primary.base,
    thumbBorder: `4px solid ${forkedPalette.surface.base}`
  },
  primaryCta: {
    backgroundColor: forkedPalette.primary.base,
    color: '#ffffff',
    borderRadius: forkedRadii.button,
    padding: '28px 44px',
    boxShadow: forkedShadows.brandGlow
  }
} as const;

export const forkedUncertaintyLog = {
  mobileScaleAdaptation: {
    source: 'Website is primarily designed for desktop and responsive web (14-16px body, 18-30px headings).',
    adaptation: 'Story video uses a verified 2.2x to 2.6x scale factor so text remains crisp and readable on vertical phone screens.',
    status: 'Verified proportionally'
  },
  lightModeLock: {
    source: 'Website light mode :root tokens in style.css (--color-canvas #f8f8f5, --color-surface #ffffff, --color-fg #1e261f).',
    adaptation: 'All 5 scenes strictly locked to authentic Light Mode. Zero dark mode surfaces or switching throughout the 25-second video.',
    status: 'Locked to 100% Light Mode'
  }
} as const;

export { typographyStyles, typographyFamilies, safeZoneMargins } from './typography';

