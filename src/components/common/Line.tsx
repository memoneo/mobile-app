import React from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { borderColor, borderRadius } from "../../lib/colors"

export default function Line(props: { style?: ViewStyle }): JSX.Element {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={StyleSheet.flatten([
          {
            height: 2,
            backgroundColor: borderColor,
            borderRadius: borderRadius,
            width: "90%",
            marginVertical: 8,
          },
          props.style,
        ])}
      />
    </View>
  )
}
