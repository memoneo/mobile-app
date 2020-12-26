import { Dayjs } from "dayjs"
import React from "react"
import { StyleSheet, View } from "react-native"
import { CalendarTopicLogMap } from "../../screens/entry/Entries"
import Month from "./Month"

interface OwnProps {
  month: Dayjs
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
  setMonth: (month: number) => void
  topicLogMap: CalendarTopicLogMap
}

type Props = OwnProps

interface State {
  startDate?: Dayjs
  endDate?: Dayjs
}

class Calendar extends React.Component<Props, State> {
  state = {}

  render(): JSX.Element {
    const { month, topicLogMap, focusedDay, focusDay, setMonth } = this.props

    return (
      <View style={styles.container}>
        <Month
          month={month}
          topicLogMap={topicLogMap}
          focusedDay={focusedDay}
          setMonth={setMonth}
          focusDay={focusDay}
        />
      </View>
    )
  }
}

export default Calendar

const styles = StyleSheet.create({
  container: {},
})
