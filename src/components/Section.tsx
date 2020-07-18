import React from "react"
import { View, StyleSheet } from "react-native"
import { borderColor } from "../lib/colors"

const Section: React.FC = props => (
  <View style={styles.sectionContainer}>{props.children}</View>
)

export default Section

const styles = StyleSheet.create({
  sectionContainer: {
    borderTopWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderColor: borderColor,
  },
})
