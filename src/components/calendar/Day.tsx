import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import MText from "../common/MText"
import { DayType } from "../../lib/month"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { borderRadius, primaryColor, secondaryColor, thirdColor } from "../../lib/colors"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import { Dayjs } from "dayjs"

interface Props {
  day: DayType
  month: Dayjs
  topicLog?: TopicLogWithDatesAsDayJs
}

export default class Day extends React.Component<Props> {
  render(): JSX.Element {
    const { day, topicLog, month } = this.props

    const isSameMonth = day.date.month() === month.month()

    const innerStyles: ViewStyle[] = [styles.dayInner]
    const textStyles: TextStyle[] = [styles.dayText]


    if (topicLog) {
      innerStyles.push(styles.dayInnerActive)
      
      if (isSameMonth) {
        textStyles.push(styles.dayTextActive)
      }
    }

    if (!isSameMonth) {
      textStyles.push(styles.dayTextInactive)
    }

    return (
      <View style={styles.day}>
        <TouchableOpacity style={innerStyles}>
          <MText style={textStyles} allowFontScaling={false}>
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
    width: 32,
    padding: 8,
    marginVertical: 4,
    borderRadius: 100,
  },
  dayInnerActive: {
    backgroundColor: primaryColor,
    color: "white",
  },
  dayTextActive: {
    color: "white",
  },
  dayTextInactive: {
    color: thirdColor,
  },
  dayText: {
    fontSize: 10,
    textAlign: "center",
  },
})
