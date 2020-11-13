import { Dayjs } from "dayjs"
import React from "react"
import { View } from "react-native"
import { getMonthDays, getDayNames, DayType } from "../../lib/month"
import Day from "./Day"
import Weekdays from "./Weekdays"

interface Props {
  month: number
  year: number
  onPress?: () => void
  showWeekdays?: boolean
  firstDayMonday?: boolean
}

interface State {}

export default class Month extends React.Component<Props, State> {
  render(): JSX.Element {
    const { month, year, firstDayMonday = true } = this.props

    const days = getMonthDays(month, year, false, [], false)
    const dayNames = getDayNames(firstDayMonday)

    const weeks: DayType[][] = []
    const showWeekdays = this.props.showWeekdays || true

    while (days.length) {
      weeks.push(days.splice(0, 7))
    }

    return (
      <React.Fragment>
        {showWeekdays && <Weekdays />}
        {weeks.map((week, idx) => (
          <View key={`week-${idx}`}>
            {week.map((day) => (
              <Day day={day} />
            ))}
          </View>
        ))}
      </React.Fragment>
    )
  }
}
