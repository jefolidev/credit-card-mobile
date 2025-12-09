import { createContext, JSX, ReactNode, useContext, useState } from 'react'
import EyeClosed from 'src/assets/eye-closed'
import EyeOpened from 'src/assets/eye-opened'

interface AmountVisibilityContextProps {
  isVisible: boolean
  eyeState: JSX.Element
  handleSetAmountVisibility: () => void
}

const DEFAULT_AMOUNT_VISIBILITY = false

const AmountVisibilityContext =
  createContext<AmountVisibilityContextProps | null>(null)

export function AmountVisibilityProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isVisible, setIsVisible] = useState(DEFAULT_AMOUNT_VISIBILITY)

  const eyeState = isVisible ? <EyeOpened /> : <EyeClosed />

  const handleSetAmountVisibility = () => {
    setIsVisible((prevState) => !prevState)
  }

  return (
    <AmountVisibilityContext.Provider
      value={{ isVisible, handleSetAmountVisibility, eyeState }}
    >
      {children}
    </AmountVisibilityContext.Provider>
  )
}

export function useAmountVisibility() {
  return useContext(AmountVisibilityContext) as AmountVisibilityContextProps
}
