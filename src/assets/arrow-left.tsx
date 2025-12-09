import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ArrowLeftIconProps {
  width?: number
  height?: number
  color?: string
  opacity?: number
}

export function ArrowLeftIcon({
  width = 32,
  height = 32,
  color = '#ffffff',
  opacity = 1,
}: ArrowLeftIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity }}
    >
      <Path
        d="M10 15.8333L4.16669 10L10 4.16666"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.8334 10H4.16669"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
