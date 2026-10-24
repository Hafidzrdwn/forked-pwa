import { h, type FunctionalComponent } from 'vue'

export interface IconProps {
  size?: number | string
  class?: string
  strokeWidth?: number | string
}

function createIcon(pathFn: () => any[]): FunctionalComponent<IconProps> {
  return (props) => {
    const s = props.size || 20
    const sw = props.strokeWidth || '2.2'
    return h(
      'svg',
      {
        width: s,
        height: s,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: sw,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        class: props.class,
        'aria-hidden': 'true'
      },
      pathFn()
    )
  }
}

// 1. Navigation & Views
export const Menu = createIcon(() => [
  h('line', { x1: '3', y1: '7', x2: '21', y2: '7' }),
  h('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
  h('line', { x1: '3', y1: '17', x2: '14', y2: '17' })
])

export const LayoutDashboard = createIcon(() => [
  h('rect', { x: '3', y: '3', width: '7', height: '8', rx: '2' }),
  h('rect', { x: '14', y: '3', width: '7', height: '5', rx: '2' }),
  h('rect', { x: '14', y: '12', width: '7', height: '9', rx: '2' }),
  h('rect', { x: '3', y: '15', width: '7', height: '6', rx: '2' })
])

// Signature Decision Branch (Forked)
export const GitBranch = createIcon(() => [
  h('circle', { cx: '6', cy: '18', r: '2.5' }),
  h('circle', { cx: '18', cy: '6', r: '2.5' }),
  h('circle', { cx: '18', cy: '18', r: '2.5' }),
  h('path', { d: 'M6 15.5V8a2 2 0 012-2h7.5' }),
  h('path', { d: 'M9 6a3 3 0 013 3v6.5h3.5' })
])

export const BookOpen = createIcon(() => [
  h('path', { d: 'M2 6.5A2.5 2.5 0 014.5 4H11v16H4.5A2.5 2.5 0 002 22.5V6.5z' }),
  h('path', { d: 'M22 6.5A2.5 2.5 0 0019.5 4H13v16h6.5A2.5 2.5 0 0122 22.5V6.5z' })
])

export const Compass = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('polygon', { points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' })
])

// 2. Action Controls
export const Plus = createIcon(() => [
  h('line', { x1: '12', y1: '5', x2: '12', y2: '19' }),
  h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
])

export const X = createIcon(() => [
  h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
  h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
])

export const Search = createIcon(() => [
  h('circle', { cx: '11', cy: '11', r: '7' }),
  h('line', { x1: '16.5', y1: '16.5', x2: '21', y2: '21' })
])

export const Trash2 = createIcon(() => [
  h('path', { d: 'M4 7h16' }),
  h('path', { d: 'M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3' }),
  h('path', { d: 'M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13' }),
  h('line', { x1: '10', y1: '11', x2: '10', y2: '17' }),
  h('line', { x1: '14', y1: '11', x2: '14', y2: '17' })
])

export const Pencil = createIcon(() => [
  h('path', { d: 'M16.5 3.5a2.121 2.121 0 013 3L7 18.5 3 20l1.5-4L16.5 3.5z' })
])

export const CalendarDays = createIcon(() => [
  h('rect', { x: '3', y: '4', width: '18', height: '17', rx: '2.5' }),
  h('line', { x1: '16', y1: '2', x2: '16', y2: '6' }),
  h('line', { x1: '8', y1: '2', x2: '8', y2: '6' }),
  h('line', { x1: '3', y1: '10', x2: '21', y2: '10' })
])

export const ArrowLeft = createIcon(() => [
  h('line', { x1: '19', y1: '12', x2: '5', y2: '12' }),
  h('polyline', { points: '12 19 5 12 12 5' })
])

export const ArrowRight = createIcon(() => [
  h('line', { x1: '5', y1: '12', x2: '19', y2: '12' }),
  h('polyline', { points: '13 6 19 12 13 18' })
])

export const Lock = createIcon(() => [
  h('rect', { x: '3', y: '11', width: '18', height: '11', rx: '2', ry: '2' }),
  h('path', { d: 'M7 11V7a5 5 0 0110 0v4' })
])

export const FileText = createIcon(() => [
  h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
  h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
  h('polyline', { points: '10 9 9 9 8 9' })
])

export const ArrowUpRight = createIcon(() => [
  h('line', { x1: '7', y1: '17', x2: '17', y2: '7' }),
  h('polyline', { points: '7 7 17 7 17 17' })
])

export const ArrowDownRight = createIcon(() => [
  h('line', { x1: '7', y1: '7', x2: '17', y2: '17' }),
  h('polyline', { points: '17 7 17 17 7 17' })
])

export const Minus = createIcon(() => [
  h('line', { x1: '5', y1: '12', x2: '19', y2: '12' })
])

export const Check = createIcon(() => [
  h('polyline', { points: '20 6 9 17 4 12' })
])

export const CheckCircle2 = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('polyline', { points: '16 9 10.5 15 8 12.5' })
])

export const Target = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('circle', { cx: '12', cy: '12', r: '3' }),
  h('line', { x1: '12', y1: '2', x2: '12', y2: '4' }),
  h('line', { x1: '12', y1: '20', x2: '12', y2: '22' }),
  h('line', { x1: '2', y1: '12', x2: '4', y2: '12' }),
  h('line', { x1: '20', y1: '12', x2: '22', y2: '12' })
])

export const RotateCcw = createIcon(() => [
  h('path', { d: 'M3 12a9 9 0 102.6-6.4L2 9' }),
  h('path', { d: 'M2 4v5h5' })
])

// 3. 4D Metric Dimensions & Calculators
export const Wallet = createIcon(() => [
  h('rect', { x: '2', y: '5', width: '20', height: '14', rx: '2.5' }),
  h('path', { d: 'M2 10h20' }),
  h('circle', { cx: '16', cy: '15', r: '1', fill: 'currentColor' })
])

export const Clock3 = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('polyline', { points: '12 7 12 12 15.5 14' })
])
export const Clock = Clock3

export const TrendingUp = createIcon(() => [
  h('polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17' }),
  h('polyline', { points: '16 7 22 7 22 13' })
])

export const ShieldAlert = createIcon(() => [
  h('path', { d: 'M12 2.5L4 6v6.5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-3.5z' }),
  h('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
  h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
])

export const ShieldCheck = createIcon(() => [
  h('path', { d: 'M12 2.5L4 6v6.5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-3.5z' }),
  h('polyline', { points: '9 12 11 14 15 10' })
])

export const Scale = createIcon(() => [
  h('path', { d: 'M12 3v18' }),
  h('path', { d: 'M4 7h16' }),
  h('path', { d: 'M4 7l3 6a3 3 0 01-6 0l3-6z' }),
  h('path', { d: 'M20 7l3 6a3 3 0 01-6 0l3-6z' }),
  h('line', { x1: '9', y1: '21', x2: '15', y2: '21' })
])

export const SlidersHorizontal = createIcon(() => [
  h('line', { x1: '3', y1: '8', x2: '21', y2: '8' }),
  h('circle', { cx: '9', cy: '8', r: '2.5', fill: 'currentColor' }),
  h('line', { x1: '3', y1: '16', x2: '21', y2: '16' }),
  h('circle', { cx: '16', cy: '16', r: '2.5', fill: 'currentColor' })
])

// 4. Alerts & Information
export const AlertCircle = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
  h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
])

export const AlertTriangle = createIcon(() => [
  h('path', { d: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' }),
  h('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
  h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
])

export const Info = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
  h('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
])

export const CircleHelp = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('path', { d: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3' }),
  h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
])

export const Lightbulb = createIcon(() => [
  h('path', { d: 'M9 18h6' }),
  h('path', { d: 'M10 22h4' }),
  h('path', { d: 'M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 00-7-7z' })
])

// 5. System, Themes & Devices
export const Sun = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '4' }),
  h('line', { x1: '12', y1: '2', x2: '12', y2: '4' }),
  h('line', { x1: '12', y1: '20', x2: '12', y2: '22' }),
  h('line', { x1: '4.93', y1: '4.93', x2: '6.34', y2: '6.34' }),
  h('line', { x1: '17.66', y1: '17.66', x2: '19.07', y2: '19.07' }),
  h('line', { x1: '2', y1: '12', x2: '4', y2: '12' }),
  h('line', { x1: '20', y1: '12', x2: '22', y2: '12' }),
  h('line', { x1: '4.93', y1: '19.07', x2: '6.34', y2: '17.66' }),
  h('line', { x1: '17.66', y1: '6.34', x2: '19.07', y2: '4.93' })
])

export const Moon = createIcon(() => [
  h('path', { d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' })
])

export const Globe = createIcon(() => [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('line', { x1: '3', y1: '12', x2: '21', y2: '12' }),
  h('path', { d: 'M12 3a14 14 0 010 18' }),
  h('path', { d: 'M12 3a14 14 0 000 18' })
])

export const Share2 = createIcon(() => [
  h('circle', { cx: '18', cy: '5', r: '2.5' }),
  h('circle', { cx: '6', cy: '12', r: '2.5' }),
  h('circle', { cx: '18', cy: '19', r: '2.5' }),
  h('line', { x1: '8.3', y1: '13.3', x2: '15.7', y2: '17.7' }),
  h('line', { x1: '15.7', y1: '6.3', x2: '8.3', y2: '10.7' })
])

export const Download = createIcon(() => [
  h('path', { d: 'M12 3v13' }),
  h('polyline', { points: '7 11 12 16 17 11' }),
  h('path', { d: 'M4 19v1a2 2 0 002 2h12a2 2 0 002-2v-1' })
])

export const Copy = createIcon(() => [
  h('rect', { x: '8', y: '8', width: '12', height: '12', rx: '2' }),
  h('path', { d: 'M4 16V6a2 2 0 012-2h10' })
])

export const FileUp = createIcon(() => [
  h('path', { d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }),
  h('polyline', { points: '14 2 14 8 20 8' }),
  h('line', { x1: '12', y1: '18', x2: '12', y2: '12' }),
  h('polyline', { points: '9 15 12 12 15 15' })
])

export const Smartphone = createIcon(() => [
  h('rect', { x: '5', y: '2', width: '14', height: '20', rx: '3' }),
  h('line', { x1: '12', y1: '18', x2: '12.01', y2: '18' })
])

export const Square = createIcon(() => [
  h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '3' })
])

export const Award = createIcon(() => [
  h('circle', { cx: '12', cy: '8', r: '5' }),
  h('polyline', { points: '8.21 13.89 7 22 12 19 17 22 15.79 13.88' })
])

export const Zap = createIcon(() => [
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
])

export const Coins = createIcon(() => [
  h('circle', { cx: '8', cy: '8', r: '6' }),
  h('path', { d: 'M18.09 10.37A6 6 0 1110.34 18' }),
  h('path', { d: 'M7 6h2' }),
  h('path', { d: 'M8 5v2' })
])

export const Activity = createIcon(() => [
  h('polyline', { points: '22 12 18 12 15 21 9 3 6 12 2 12' })
])

export const Database = createIcon(() => [
  h('ellipse', { cx: '12', cy: '5', rx: '9', ry: '3' }),
  h('path', { d: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' }),
  h('path', { d: 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' })
])

export const ExternalLink = createIcon(() => [
  h('path', { d: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' }),
  h('polyline', { points: '15 3 21 3 21 9' }),
  h('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
])
