import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface CartIconProps {
  width?: number
  height?: number
  color?: string
}

export function CartIcon({
  width = 24,
  height = 24,
  color = '#10b981',
}: CartIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 21C18.5523 21 19 20.5523 19 20C19 19.4477 18.5523 19 18 19C17.4477 19 17 19.4477 17 20C17 20.5523 17.4477 21 18 21Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 21C9.55228 21 10 20.5523 10 20C10 19.4477 9.55228 19 9 19C8.44772 19 8 19.4477 8 20C8 20.5523 8.44772 21 9 21Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
