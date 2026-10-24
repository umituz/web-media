import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function Svg({ size = 18, ...props }: IconProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...props} />
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.9-6.86a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86z" />
    </Svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </Svg>
  )
}

export function Back10Icon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fill="currentColor" stroke="none">
        10
      </text>
    </Svg>
  )
}

export function Forward10Icon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fill="currentColor" stroke="none">
        10
      </text>
    </Svg>
  )
}

export function VolumeIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Svg>
  )
}

export function VolumeXIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </Svg>
  )
}

export function MaximizeIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </Svg>
  )
}

export function MinimizeIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </Svg>
  )
}
