import Svg, { Path, Rect } from 'react-native-svg'

export default function CreditCartIcon(props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <Rect width="20" height="20" fill="white" />
      <Path
        d="M16.6667 4.16667H3.33341C2.41294 4.16667 1.66675 4.91286 1.66675 5.83333V14.1667C1.66675 15.0871 2.41294 15.8333 3.33341 15.8333H16.6667C17.5872 15.8333 18.3334 15.0871 18.3334 14.1667V5.83333C18.3334 4.91286 17.5872 4.16667 16.6667 4.16667Z"
        stroke="url(#paint0_linear_58_895)"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M1.66675 8.33333H18.3334"
        stroke="url(#paint1_linear_58_895)"
        stroke-width="1.66667"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  )
}
