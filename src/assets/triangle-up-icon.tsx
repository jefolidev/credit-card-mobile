import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface TriangleUpIconProps {
  width?: number
  height?: number
  color?: string
}

export function TriangleUpIcon({
  width = 16,
  height = 16,
  color = '#10b981',
}: TriangleUpIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 3a1.5 1.5 0 011.298.75l4 7A1.5 1.5 0 0112 13H4a1.5 1.5 0 01-1.298-2.25l4-7A1.5 1.5 0 018 3z"
        fill={color}
      />
    </Svg>
  )
}

export default TriangleUpIcon
