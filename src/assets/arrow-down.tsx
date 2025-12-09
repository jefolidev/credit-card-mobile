import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ArrowDownIconProps {
  width?: number
  height?: number
  color?: string
  opacity?: number
}

export function ArrowDownIcon({
  width = 32,
  height = 32,
  color = '#ffffff',
  opacity = 1,
}: ArrowDownIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity }}
    >
      <Path
        d="M16 17H22V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 17L13.5 8.5L8.5 13.5L2 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ArrowDownIcon
