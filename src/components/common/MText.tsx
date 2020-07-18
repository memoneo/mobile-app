import React from "react"

import { Text, TextProps } from "react-native-elements"
import { StyleSheet, View } from "react-native"
import { textStandardColor } from "../../lib/colors"

interface OwnProps {
  bold?: boolean
  wrapInView?: boolean
  includeFontPadding?: boolean
}

type Props = OwnProps & TextProps

const MText: React.FC<Props> = ({
  children,
  style,
  h1,
  h2,
  h3,
  h4,
  bold,
  wrapInView,
  ...rest
}) => {
  const dynamicStyle: any = {}

  if (h1) {
    dynamicStyle.fontSize = 40
  } else if (h2) {
    dynamicStyle.fontSize = 34
  } else if (h3) {
    dynamicStyle.fontSize = 28
  } else if (h4) {
    dynamicStyle.fontSize = 22
  }

  if (bold) {
    dynamicStyle.fontFamily = "Nunito-Bold"
  }

  return wrapInView ? (
    <View>
      <Text
        {...rest}
        style={StyleSheet.flatten([localStyle.text, dynamicStyle, style])}
      >
        {children}
      </Text>
    </View>
  ) : (
    <Text
      {...rest}
      style={StyleSheet.flatten([localStyle.text, dynamicStyle, style])}
    >
      {children}
    </Text>
  )
}

const localStyle = StyleSheet.create({
  text: {
    color: textStandardColor,
    fontFamily: "Nunito-Regular",
  },
})

export default MText
