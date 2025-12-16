import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface KeyIconProps {
  width?: number
  height?: number
  color?: string
}

export function KeyIcon({
  width = 24,
  height = 24,
  color = '#6b7280',
}: KeyIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M12.9166 6.24998L14.8333 8.16665C14.9891 8.31934 15.1985 8.40486 15.4166 8.40486C15.6348 8.40486 15.8442 8.31934 16 8.16665L17.75 6.41665C17.9026 6.26087 17.9882 6.05144 17.9882 5.83331C17.9882 5.61519 17.9026 5.40575 17.75 5.24998L15.8333 3.33331"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.5 1.66669L9.5 9.66669"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.24996 17.5C8.78126 17.5 10.8333 15.448 10.8333 12.9166C10.8333 10.3853 8.78126 8.33331 6.24996 8.33331C3.71865 8.33331 1.66663 10.3853 1.66663 12.9166C1.66663 15.448 3.71865 17.5 6.24996 17.5Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default KeyIcon
