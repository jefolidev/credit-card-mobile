import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

interface IdentificationIconProps {
  width?: number
  height?: number
  color?: string
}

export function IdentificationIcon({
  width = 24,
  height = 24,
  color = '#6b7280',
}: IdentificationIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G clip-path="url(#clip0_217_3980)">
        <Path
          d="M13.3334 8.33334H15"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M13.3334 11.6667H15"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M5.14172 12.5C5.31351 12.0117 5.63264 11.5887 6.05507 11.2895C6.4775 10.9903 6.9824 10.8296 7.50006 10.8296C8.01772 10.8296 8.52261 10.9903 8.94504 11.2895C9.36747 11.5887 9.68661 12.0117 9.85839 12.5"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7.50004 10.8333C8.42052 10.8333 9.16671 10.0871 9.16671 9.16667C9.16671 8.24619 8.42052 7.5 7.50004 7.5C6.57957 7.5 5.83337 8.24619 5.83337 9.16667C5.83337 10.0871 6.57957 10.8333 7.50004 10.8333Z"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16.6666 4.16666H3.33329C2.41282 4.16666 1.66663 4.91285 1.66663 5.83332V14.1667C1.66663 15.0871 2.41282 15.8333 3.33329 15.8333H16.6666C17.5871 15.8333 18.3333 15.0871 18.3333 14.1667V5.83332C18.3333 4.91285 17.5871 4.16666 16.6666 4.16666Z"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_217_3980">
          <Rect width={width} height={height} fill={color} />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default IdentificationIcon
