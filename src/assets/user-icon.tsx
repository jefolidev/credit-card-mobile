import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface UserIconProps {
  width?: number
  height?: number
  color?: string
}

export function UserIcon({
  width = 24,
  height = 24,
  color = '#6b7280',
}: UserIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default UserIcon
