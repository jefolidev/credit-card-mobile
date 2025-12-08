import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface ExclamationIconProps {
  width?: number
  height?: number
  color?: string
}

export function ExclamationIcon({
  width = 20,
  height = 20,
  color = '#EA580C',
}: ExclamationIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ExclamationIcon
