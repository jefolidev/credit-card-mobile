import Svg, { Path } from 'react-native-svg'
import { STROKE_WIDTHS, SVGIconProps } from '../types/svg-icons'

export default function ClockIcon({
  height = 20,
  width = 20,
  strokeWeight = 'regular',
  strokeColor = '#fff',
  ...rest
}: SVGIconProps & { strokeWeight?: keyof typeof STROKE_WIDTHS }) {
  const strokeWidth = STROKE_WIDTHS[strokeWeight]

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      <Path
        d="M10 5V10L13.3333 11.6667"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6023 1.66667 9.99996 1.66667C5.39759 1.66667 1.66663 5.39763 1.66663 10C1.66663 14.6024 5.39759 18.3333 9.99996 18.3333Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
