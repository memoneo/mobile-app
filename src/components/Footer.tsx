import * as React from "react"
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native"
import HomeIcon from "../assets/home.svg"

interface Props {
}

const Footer: React.FC<Props> = props => (
  <View style={styles.footer}>
  </View>
)

const styles = StyleSheet.create({
  footer: {
    flex: 0,
    padding: 10,
    backgroundColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default Footer
