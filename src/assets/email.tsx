import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface LetterIconProps {
  width?: number
  height?: number
  color?: string
}

export function LetterIcon({
  width = 16,
  height = 16,
  color = '#773CBD',
}: LetterIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M18.3334 5.83334L10.8409 10.6058C10.5867 10.7535 10.2979 10.8313 10.0038 10.8313C9.7098 10.8313 9.421 10.7535 9.16675 10.6058L1.66675 5.83334"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.6667 3.33334H3.33341C2.41294 3.33334 1.66675 4.07954 1.66675 5.00001V15C1.66675 15.9205 2.41294 16.6667 3.33341 16.6667H16.6667C17.5872 16.6667 18.3334 15.9205 18.3334 15V5.00001C18.3334 4.07954 17.5872 3.33334 16.6667 3.33334Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
