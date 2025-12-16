import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface LocalPinIconProps {
  width?: number
  height?: number
  color?: string
}

export function LocalPinIcon({
  width = 24,
  height = 24,
  color = '#6b7280',
}: LocalPinIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M16.6667 8.33332C16.6667 12.4942 12.0509 16.8275 10.5009 18.1658C10.3565 18.2744 10.1807 18.3331 10 18.3331C9.81938 18.3331 9.6436 18.2744 9.49921 18.1658C7.94921 16.8275 3.33337 12.4942 3.33337 8.33332C3.33337 6.56521 4.03575 4.86952 5.286 3.61928C6.53624 2.36904 8.23193 1.66666 10 1.66666C11.7682 1.66666 13.4638 2.36904 14.7141 3.61928C15.9643 4.86952 16.6667 6.56521 16.6667 8.33332Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 10.8333C11.3807 10.8333 12.5 9.71406 12.5 8.33334C12.5 6.95263 11.3807 5.83334 10 5.83334C8.61929 5.83334 7.5 6.95263 7.5 8.33334C7.5 9.71406 8.61929 10.8333 10 10.8333Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default LocalPinIcon
