import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import MText from "../common/MText"
import { DayType } from "../../lib/month"
import { StyleSheet } from "react-native"
import { borderRadius, secondaryColor, thirdColor } from "../../lib/colors"

interface Props {
  day: DayType
}

export default class Day extends React.Component<Props> {
  render(): JSX.Element {
    const { day } = this.props

    return (
      <TouchableOpacity style={styles.day}>
        <MText>{day.date.format("DD")}</MText>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  day: {
    padding: 12,
    margin: 4,
    backgroundColor: thirdColor,
    borderRadius: borderRadius,
  },
})
