import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ChevronRightIconProps {
  width?: number
  height?: number
  color?: string
}

export function ChevronRightIcon({
  width = 16,
  height = 16,
  color = '#6b7280',
}: ChevronRightIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 12l4-4-4-4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ChevronRightIcon
