import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ChartBarIconProps {
  width?: string | number
  height?: string | number
  color?: string
}

export function ChartBarIcon({
  width = 24,
  height = 24,
  color = '#000000',
  ...props
}: ChartBarIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M3 3V21H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9V17M15 7V17M7 13V17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
