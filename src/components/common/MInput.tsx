import React from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"
import {
  borderRadius,
  borderColor,
  buttonBackgroundColor,
} from "../../lib/colors"

interface OwnProps {
  value: string
  placeholder?: string
  onChangeText: (text: string) => void
}

type Props = OwnProps & TextInputProps

const MInput: React.FC<Props> = props => (
  <TextInput
    {...props}
    selectionColor={buttonBackgroundColor}
    style={StyleSheet.flatten([style.input, props.style])}
    placeholder={props.placeholder}
    value={props.value}
    onChangeText={props.onChangeText}
  />
)

const style = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius,
    borderColor,
    fontFamily: "Nunito-Regular",
    marginVertical: 4,
  },
})

export default MInput
