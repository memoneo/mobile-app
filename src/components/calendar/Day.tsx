import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import MText from "../common/MText"
import { DayType } from "../../lib/month"
import { StyleSheet, View } from "react-native"
import { borderRadius, secondaryColor, thirdColor } from "../../lib/colors"

interface Props {
  day: DayType
}

export default class Day extends React.Component<Props> {
  render(): JSX.Element {
    const { day } = this.props
    return (
      <View style={styles.day}>
        <TouchableOpacity style={styles.dayInner}>
          <MText style={styles.dayText} allowFontScaling={false}>
            {day.date.format("D")}
          </MText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  day: {
    flex: 1,
    alignItems: "center",
  },
  dayInner: {
    padding: 8,
    marginVertical: 4,
  },
  dayText: {
    fontSize: 10,
    textAlign: "center",
  },
})
