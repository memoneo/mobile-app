import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"

import ProgressBar from "react-native-progress/Bar"
import { primaryColor, secondaryColor } from "../lib/colors"

interface Props {
  loading: boolean
}

export default function LoadingIndicator(props: Props): JSX.Element {
  if (!props.loading) {
    return null
  }

  return (
    <View style={styles.container}>
      <ProgressBar
        indeterminate
        color={secondaryColor}
        width={Dimensions.get("window").width}
        height={2}
        borderWidth={0}
        animationType="decay"
        unfilledColor="white"
        animationConfig={{bounciness: 3}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "stretch",
    bottom: 0,
    zIndex: 1,
  },
})
