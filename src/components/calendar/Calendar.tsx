import dayjs, { Dayjs } from "dayjs"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import React from "react"
import { StyleSheet, View } from "react-native"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { focusedTextColor } from "../../lib/colors"
import { RootState } from "../../redux"
import { TopicActions, TopicLogValueMap } from "../../redux/topic"
import { CalendarTopicLogMap } from "../../screens/entry/Entries"
import Line from "../common/Line"
import MButton from "../common/MButton"
import MText from "../common/MText"
import Month from "./Month"

interface OwnProps {
  month: Dayjs
  focusedDay: Dayjs
  focusDay: (day: Dayjs) => void
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
    const { month, topicLogMap, focusedDay, focusDay } = this.props

    return (
      <View style={styles.container}>
        <Month
          month={month}
          topicLogMap={topicLogMap}
          focusedDay={focusedDay}
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
