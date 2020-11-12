import React from "react"
import { StyleSheet, ViewStyle, StyleProp, TextStyle } from "react-native"
import { Picker } from "@react-native-community/picker"
import {
  PickerProps,
  PickerItemProps,
} from "@react-native-community/picker/typings/Picker"

interface OwnMPickerProps {
  style?: TextStyle
}

type MPickerProps = OwnMPickerProps & PickerProps

const MPicker: React.FC<MPickerProps> = ({ style, children, ...props }) => (
  <Picker
    style={StyleSheet.flatten([pickerStyles.picker, style])}
    itemStyle={StyleSheet.flatten([pickerStyles.item])}
    {...props}
  >
    {children}
  </Picker>
)

const pickerStyles = StyleSheet.create({
  picker: {
    paddingVertical: 4,
    fontFamily: "Nunito-Regular",
  },
  item: {
    backgroundColor: "black",
    color: "red",
    fontFamily: "Nunito-Regular",
  },
})

interface OwnMPickerItemProps {
  style?: ViewStyle
}

type MPickerItemProps = OwnMPickerItemProps & PickerItemProps

export const MPickerItem: React.FC<MPickerItemProps> = ({
  style,
  children,
  ...props
}) => <Picker.Item {...props}>{children}</Picker.Item>

export default MPicker
