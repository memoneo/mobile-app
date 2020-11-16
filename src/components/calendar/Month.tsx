import { Dayjs } from "dayjs"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Icon } from "react-native-elements"
import {
  primaryColor,
  secondaryColor,
  textStandardColor,
  thirdColor,
} from "../../lib/colors"
import {
  getMonthDays,
  getDayNames,
  DayType,
  getMonthNames,
} from "../../lib/month"
import MText from "../common/MText"
import { CalendarTopicLogMap } from "./Calendar"
import Day from "./Day"
import Weekdays from "./Weekdays"

interface Props {
  month: Dayjs
  topicLogMap: CalendarTopicLogMap
  onPress?: () => void
  showWeekdays?: boolean
  firstDayMonday?: boolean
}

interface State {}

export default class Month extends React.Component<Props, State> {
  render(): JSX.Element {
    const { month, firstDayMonday = true, topicLogMap } = this.props

    const days = getMonthDays(month.month(), month.year(), false, [], false)
    const dayNames = getDayNames(firstDayMonday)

    const weeks: DayType[][] = []
    const showWeekdays = this.props.showWeekdays || true

    while (days.length) {
      weeks.push(days.splice(0, 7))
    }

    return (
      <View style={styles.container}>
        <View style={styles.monthNameContainer}>
          <Icon
            name="chevron-left"
            type="feather"
            color={thirdColor}
            style={styles.monthNameIcon}
          />
          <View style={styles.monthName}>
            <MText bold style={styles.monthNameText}>
              {month.format("MMMM, YYYY")}
            </MText>
          </View>
          <Icon
            name="chevron-right"
            type="feather"
            color={thirdColor}
            style={styles.monthNameIcon}
          />
        </View>
        {showWeekdays && <Weekdays days={dayNames} />}
        <View style={styles.weeksContainer}>
          {weeks.map((week, idx) => (
            <View key={`week-${idx}`} style={styles.weeks}>
              {week.map((day) => {
                return (
                  <Day
                    key={`day-${day.id}`}
                    day={day}
                    month={month}
                    topicLog={topicLogMap[day.date.month()]?.[day.date.date()]}
                  />
                )
              })}
            </View>
          ))}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  weeks: {
    flexDirection: "row",
  },
  monthNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  monthNameText: {
    textAlign: "center",
    color: "white",
  },
  monthNameIcon: {
    marginHorizontal: 12,
  },
  monthName: {
    backgroundColor: secondaryColor,
    color: textStandardColor,
    paddingVertical: 2,
    paddingHorizontal: 8,
    width: 140,
    borderRadius: 100,
  },
  weeksContainer: {},
})
