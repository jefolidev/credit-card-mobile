import React from 'react'
import Svg, { Path, Rect } from 'react-native-svg'

interface UnlockIconProps {
  width?: number
  height?: number
  color?: string
}

export function UnlockIcon({
  width = 18,
  height = 18,
  color = '#99A1AF',
}: UnlockIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Rect
        x="3"
        y="9"
        width="14"
        height="8"
        rx="2"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 9V6a4 4 0 0 1 8 0v1"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 12v2"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
