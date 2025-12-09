import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface TriangleDownIconProps {
  width?: number
  height?: number
  color?: string
}

export function TriangleDownIcon({
  width = 16,
  height = 16,
  color = '#ef4444',
}: TriangleDownIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 13a1.5 1.5 0 01-1.298-.75l-4-7A1.5 1.5 0 014 3h8a1.5 1.5 0 011.298 2.25l-4 7A1.5 1.5 0 018 13z"
        fill={color}
      />
    </Svg>
  )
}

export default TriangleDownIcon
