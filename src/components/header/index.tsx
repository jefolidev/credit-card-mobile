import React, { JSX } from 'react'
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native'
import { ArrowLeftIcon } from 'src/assets/arrow-left'
import { colors } from 'src/theme/colors'
import { ButtonIcon } from '../button-icon'
import { Title } from '../title'

interface HeaderProps extends ViewProps {
  icon?: JSX.Element | string
  title: string
  isIconClickable?: boolean
  onBackPress?: () => void
  showBackButton?: boolean
  rightButton?: JSX.Element
}

export function Header({
  icon,
  title,
  isIconClickable = false,
  onBackPress,
  showBackButton = false,
  rightButton,
  ...rest
}: HeaderProps) {
  const { height: screenHeight } = Dimensions.get('window')
  const safeTopPadding = Platform.select({
    ios: screenHeight > 800 ? 44 + 16 : 20 + 16,
    android: StatusBar.currentHeight ? StatusBar.currentHeight + 24 : 40,
    default: 48,
  })

  return (
    <View
      style={[headerStyles.container, { paddingTop: safeTopPadding }]}
      {...rest}
    >
      {showBackButton || onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
          <ArrowLeftIcon width={24} height={24} color={colors.primaryText} />
        </TouchableOpacity>
      ) : (
        <ButtonIcon icon={icon ?? <></>} isClickable={isIconClickable} />
      )}
      <Title>{title}</Title>
      {rightButton && (
        <View
          style={[
            headerStyles.rightButton,
            { justifyContent: rightButton ? 'flex-start' : 'space-between' },
          ]}
        >
          {rightButton}
        </View>
      )}
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingBlockStart: 24,
    paddingBlockEnd: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  rightButton: {
    marginLeft: 'auto',
  },
})
