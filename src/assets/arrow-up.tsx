import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ArrowUpIconProps {
  width?: number
  height?: number
  color?: string
  opacity?: number
}

export function ArrowUpIcon({
  width = 24,
  height = 24,
  color = '#ffffff',
  opacity = 0.1,
}: ArrowUpIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 128 128"
      fill="none"
      style={{ opacity }}
    >
      <Path
        d="M85.3334 37.3333H117.333V69.3333"
        stroke={color}
        strokeWidth={10.6667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M117.333 37.3333L72 82.6667L45.3333 56L10.6666 90.6667"
        stroke={color}
        strokeWidth={10.6667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ArrowUpIcon
