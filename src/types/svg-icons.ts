export const STROKE_WIDTHS: Record<
  'thin' | 'regular' | 'medium' | 'bold',
  number
> = {
  thin: 1,
  regular: 1.66667,
  medium: 2.5,
  bold: 3,
}

export type SVGIconProps = {
  width?: number
  height?: number
  strokeWidth?: keyof typeof STROKE_WIDTHS
  strokeColor?: string
}
