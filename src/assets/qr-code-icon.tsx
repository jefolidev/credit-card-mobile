import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface QrCodeIconProps {
  width?: string | number
  height?: string | number
  color?: string
}

export function QrCodeIcon({
  width = 24,
  height = 24,
  color = '#FFFFFF',
  ...props
}: QrCodeIconProps) {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <Path
        d="M8.16667 3.5H4.66667C4.02233 3.5 3.5 4.02233 3.5 4.66667V8.16667C3.5 8.811 4.02233 9.33333 4.66667 9.33333H8.16667C8.811 9.33333 9.33333 8.811 9.33333 8.16667V4.66667C9.33333 4.02233 8.811 3.5 8.16667 3.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.3334 3.5H19.8334C19.189 3.5 18.6667 4.02233 18.6667 4.66667V8.16667C18.6667 8.811 19.189 9.33333 19.8334 9.33333H23.3334C23.9777 9.33333 24.5 8.811 24.5 8.16667V4.66667C24.5 4.02233 23.9777 3.5 23.3334 3.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.16667 18.6667H4.66667C4.02233 18.6667 3.5 19.189 3.5 19.8334V23.3334C3.5 23.9777 4.02233 24.5 4.66667 24.5H8.16667C8.811 24.5 9.33333 23.9777 9.33333 23.3334V19.8334C9.33333 19.189 8.811 18.6667 8.16667 18.6667Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24.5 18.6667H21C20.3812 18.6667 19.7877 18.9125 19.3501 19.3501C18.9125 19.7877 18.6667 20.3812 18.6667 21V24.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24.5 24.5V24.5117"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 8.16669V11.6667C14 12.2855 13.7542 12.879 13.3166 13.3166C12.879 13.7542 12.2855 14 11.6667 14H8.16669"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.5 14H3.51167"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 3.5H14.0117"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 18.6667V18.6784"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.6667 14H19.8334"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24.5 14V14.0117"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 24.5V23.3333"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
