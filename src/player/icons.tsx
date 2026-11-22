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

export function NextIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M5 4.5v15a1 1 0 0 0 1.5.86l9.5-7.5a1 1 0 0 0 0-1.72L6.5 3.64A1 1 0 0 0 5 4.5z" />
      <rect x="17" y="4" width="2" height="16" rx="1" />
    </Svg>
  )
}

export function PrevIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M19 19.5v-15a1 1 0 0 0-1.5-.86l-9.5 7.5a1 1 0 0 0 0 1.72l9.5 7.5a1 1 0 0 0 1.5-.86z" />
      <rect x="5" y="4" width="2" height="16" rx="1" />
    </Svg>
  )
}

export function MicIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </Svg>
  )
}

export function SquareIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </Svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </Svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  )
}

export function ScreenIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </Svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </Svg>
  )
}
