import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import MText from "../common/MText"
import { DayType } from "../../lib/month"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import {
  thirdColor,
} from "../../lib/colors"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import { Dayjs } from "dayjs"

interface Props {
  day: DayType
  month: Dayjs
  topicLog?: TopicLogWithDatesAsDayJs
  isFocused: boolean
  onPress?: () => void
}

export default class Day extends React.Component<Props> {
  render(): JSX.Element {
    const { day, topicLog, month, isFocused, onPress } = this.props

    const isSameMonth = day.date.month() === month.month()

    const innerStyles: ViewStyle[] = [styles.dayInner]
    const textStyles: TextStyle[] = [styles.dayText]

    if (isFocused) {
      innerStyles.push(styles.dayInnerFocused)
    }

    if (topicLog) {
      if (isSameMonth) {
        innerStyles.push(styles.dayInnerActive)

        textStyles.push(styles.dayTextActive)
      } else {
        innerStyles.push(styles.dayInnerActiveNoTopicLog)
      }
    }

    if (!isSameMonth) {
      if (!topicLog) {
        textStyles.push(styles.dayTextInactive)
      } else {
        textStyles.push(styles.dayTextInactiveNoTopicLog)
      }
    }

    return (
      <View style={styles.day}>
        <TouchableOpacity style={innerStyles} onPress={onPress}>
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
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 100,
  },
  dayInnerActive: {
    backgroundColor: thirdColor,
    color: "white",
  },
  dayInnerActiveNoTopicLog: {
    borderColor: thirdColor,
    borderWidth: 1,
    marginVertical: 3,
  },
  dayInnerFocused: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 8,
  },
  dayTextActive: {
    color: "white",
  },
  dayTextInactive: {
    color: thirdColor,
  },
  dayTextInactiveNoTopicLog: {
    color: thirdColor,
  },
  dayText: {
    fontSize: 10,
    textAlign: "center",
  },
})
