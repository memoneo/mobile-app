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
    style={StyleSheet.flatten([style, pickerStyles.picker])}
    itemStyle={StyleSheet.flatten([pickerStyles.item])}
    {...props}
  >
    {children}
  </Picker>
)

const pickerStyles = StyleSheet.create({
  picker: {
    paddingVertical: 4,
  },
  item: {
    backgroundColor: "black",
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

const pickerItemStyles = StyleSheet.create({
  item: {
    fontFamily: "Nunito-Regular",
  },
})

export default MPicker
