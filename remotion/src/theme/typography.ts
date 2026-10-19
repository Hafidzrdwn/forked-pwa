import React from 'react';
import { forkedPalette } from './forkedTheme';

export const typographyFamilies = {
  display: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  sans: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
} as const;

export const typographyStyles = {
  mainHook: {
    fontFamily: typographyFamilies.display,
    fontSize: 78,
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: -1.8,
    color: forkedPalette.text.primary,
    textAlign: 'center' as const,
    margin: 0,
    maxWidth: 960
  } satisfies React.CSSProperties,

  mainHookAccent: {
    color: forkedPalette.primary.base
  } satisfies React.CSSProperties,

  sceneHeadline: {
    fontFamily: typographyFamilies.display,
    fontSize: 58,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: -1.2,
    color: forkedPalette.text.primary,
    textAlign: 'center' as const,
    margin: 0,
    maxWidth: 960
  } satisfies React.CSSProperties,

  largeSimulationNumber: {
    fontFamily: typographyFamilies.display,
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: -0.8,
    color: forkedPalette.text.primary,
    fontVariantNumeric: 'tabular-nums' as const
  } satisfies React.CSSProperties,

  largeSimulationNumberPrimary: {
    fontFamily: typographyFamilies.display,
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: -0.8,
    color: forkedPalette.primary.base,
    fontVariantNumeric: 'tabular-nums' as const
  } satisfies React.CSSProperties,

  largeSimulationNumberScore: {
    fontFamily: typographyFamilies.display,
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: -1.0,
    color: forkedPalette.text.primary,
    fontVariantNumeric: 'tabular-nums' as const
  } satisfies React.CSSProperties,

  supportingExplanation: {
    fontFamily: typographyFamilies.sans,
    fontSize: 26,
    fontWeight: 500,
    lineHeight: 1.45,
    letterSpacing: -0.2,
    color: forkedPalette.text.muted,
    textAlign: 'center' as const,
    maxWidth: 880,
    margin: 0
  } satisfies React.CSSProperties,

  supportingExplanationCard: {
    fontFamily: typographyFamilies.sans,
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: -0.1,
    color: forkedPalette.text.muted
  } satisfies React.CSSProperties,

  uiLabels: {
    fontFamily: typographyFamilies.sans,
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: 0.6,
    color: forkedPalette.text.muted,
    textTransform: 'uppercase' as const
  } satisfies React.CSSProperties,

  uiLabelsValue: {
    fontFamily: typographyFamilies.sans,
    fontSize: 26,
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: 0,
    color: forkedPalette.text.primary
  } satisfies React.CSSProperties,

  uiPill: {
    fontFamily: typographyFamilies.sans,
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const
  } satisfies React.CSSProperties,

  finalTaglineWordmark: {
    fontFamily: typographyFamilies.display,
    fontSize: 104,
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: -2.5,
    color: forkedPalette.text.primary
  } satisfies React.CSSProperties,

  finalTaglineCta: {
    fontFamily: typographyFamilies.display,
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: -0.6,
    color: '#ffffff'
  } satisfies React.CSSProperties,

  finalTaglinePunchline: {
    fontFamily: typographyFamilies.display,
    fontSize: 84,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: -1.8,
    color: forkedPalette.text.primary,
    textAlign: 'center' as const,
    margin: 0,
    maxWidth: 960
  } satisfies React.CSSProperties
} as const;

export const safeZoneMargins = {
  top: 180,
  bottom: 220,
  horizontal: 72
} as const;

export const typography = typographyStyles;

