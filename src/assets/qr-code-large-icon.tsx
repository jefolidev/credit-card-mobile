import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface QrCodeLargeIconProps {
  width?: number
  height?: number
  color?: string
}

export function QrCodeLargeIcon({
  width = 32,
  height = 32,
  color = '#8200DB',
}: QrCodeLargeIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3H11V11H3V3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 3H21V11H13V3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 13H11V21H3V13Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M5 5H9V9H5V5Z" fill={color} />
      <Path d="M15 5H19V9H15V5Z" fill={color} />
      <Path d="M5 15H9V19H5V15Z" fill={color} />
      <Path d="M13 13H15V15H13V13Z" fill={color} />
      <Path d="M19 13H21V15H19V13Z" fill={color} />
      <Path d="M17 17H19V19H17V17Z" fill={color} />
      <Path d="M21 17H23V19H21V17Z" fill={color} />
      <Path d="M17 21H19V23H17V21Z" fill={color} />
    </Svg>
  )
}
