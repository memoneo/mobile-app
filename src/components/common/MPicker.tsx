import React from "react"
import {
  StyleSheet,
  Picker,
  PickerProps,
  ViewStyle,
  StyleProp,
  PickerItemProps,
} from "react-native"

interface OwnMPickerProps {
  style?: ViewStyle
}

type MPickerProps = OwnMPickerProps & PickerProps

const MPicker: React.FC<MPickerProps> = ({ style, children, ...props }) => (
  <Picker
    style={StyleSheet.flatten([style, pickerStyles.picker])}
    itemStyle={StyleSheet.flatten([pickerStyles.item])}
    {...props}>
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
