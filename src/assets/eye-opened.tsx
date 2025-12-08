import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
import { STROKE_WIDTHS, SVGIconProps } from 'src/types/svg-icons'

export default function EyeOpened({
  height = 20,
  width = 20,
  strokeWeight = 'regular',
  strokeColor = 'currentColor',
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
      <G clip-path="url(#clip0_58_2410)">
        <Path
          d="M1.71835 10.29C1.6489 10.1029 1.6489 9.89709 1.71835 9.71C2.39476 8.06987 3.54294 6.66753 5.01732 5.68074C6.4917 4.69396 8.22588 4.16718 10 4.16718C11.7741 4.16718 13.5083 4.69396 14.9827 5.68074C16.4571 6.66753 17.6053 8.06987 18.2817 9.71C18.3511 9.89709 18.3511 10.1029 18.2817 10.29C17.6053 11.9301 16.4571 13.3325 14.9827 14.3192C13.5083 15.306 11.7741 15.8328 10 15.8328C8.22588 15.8328 6.4917 15.306 5.01732 14.3192C3.54294 13.3325 2.39476 11.9301 1.71835 10.29Z"
          stroke="#FAF9F6"
          stroke-width={strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
          stroke="#FAF9F6"
          stroke-width={strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_58_2410">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
