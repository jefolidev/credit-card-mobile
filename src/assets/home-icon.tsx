import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface HomeIconProps {
  width?: number
  height?: number
  color?: string
}

export function HomeIcon({
  width = 24,
  height = 24,
  color = '#6b7280',
}: HomeIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 22V12h6v10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default HomeIcon
