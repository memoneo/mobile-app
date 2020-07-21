import React from "react"
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native"
import { Button, ButtonProps } from "react-native-elements"
import {
  buttonBackgroundColor,
  primaryColor,
  focusedTextColor,
} from "../../lib/colors"

interface OwnProps {
  loading?: boolean
  title?: string
  buttonStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  type?: "solid" | "clear" | "outline"
}

type Props = OwnProps & ButtonProps

const MButton: React.FC<Props> = ({ buttonStyle, titleStyle, ...props }) => {
  const type = props.type || "solid"

  const buttonStyles: StyleProp<ViewStyle>[] = [style.button]
  const titleStyles: StyleProp<TextStyle>[] = [style.title]
  if (type === "solid") buttonStyles.push(style.buttonSolid)
  if (type === "outline") buttonStyles.push(style.buttonOutline)
  if (props.disabled) buttonStyles.push(style.disabled)
  if (buttonStyle) buttonStyles.push(buttonStyle)
  if (type === "outline") titleStyles.push(style.outlineTitle)
  if (titleStyle) titleStyles.push(titleStyle)

  return (
    <Button
      {...props}
      titleStyle={StyleSheet.flatten(titleStyles)}
      buttonStyle={StyleSheet.flatten(buttonStyles)}
      title={props.title}
      type={type}
      disabled={props.disabled}
    />
  )
}

const style = StyleSheet.create({
  button: {
    borderRadius: 50,
    marginVertical: 2,
    height: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Nunito-Regular",
  },
  buttonSolid: {
    backgroundColor: buttonBackgroundColor,
  },
  buttonOutline: {
    borderWidth: 0.8,
    borderColor: primaryColor,
  },
  disabled: {
    backgroundColor: "grey",
  },
  outlineTitle: {
    color: focusedTextColor,
  },
})

export default MButton
