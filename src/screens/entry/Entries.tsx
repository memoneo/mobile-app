import dayjs, { Dayjs } from "dayjs"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import React from "react"
import { StyleSheet, View } from "react-native"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import Calendar from "../../components/calendar/Calendar"
import Line from "../../components/common/Line"
import MButton from "../../components/common/MButton"
import MText from "../../components/common/MText"
import { RootState } from "../../redux"
import { TopicActions, TopicLogValueMap } from "../../redux/topic"

interface OwnProps {}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface StateProps {
  // loading: boolean
  // error: string
  topicLogs: TopicLogWithDatesAsDayJs[]
  topicLogValueMap: TopicLogValueMap
}

interface DispatchProps {
  topicActions: typeof TopicActions
}

interface State {
  focusedDay: Dayjs
}

export interface CalendarTopicLogMap {
  [key: number]: { [key: number]: TopicLogWithDatesAsDayJs }
}

class Entries extends React.Component<Props, State> {
  state = {
    focusedDay: dayjs(new Date()),
  }

  componentDidMount() {
    if (this.props.topicLogs.length === 0) {
      this.props.topicActions.getTopicLogsRequest()
    }
  }

  focusDay = (day: Dayjs) => {
    this.setState({ focusedDay: day })
  }

  render(): JSX.Element {
    const { focusedDay } = this.state

    const { topicLogs } = this.props

    const month = dayjs()

    const topicLogMap: CalendarTopicLogMap = {}
    const adjustedTopicLogs = topicLogs.filter(topicLog => {
      const sameYear = topicLog.date.year() === month.year()
      const topicLogMonth = topicLog.date.month()
      const currentMonth = month.month()

      const monthDiff = Math.abs(topicLogMonth - currentMonth)
      const date = topicLog.date.date()

      return (
        sameYear &&
        (monthDiff === 0 || (monthDiff === 1 && (date >= 25 || date <= 6)))
      )
    })

    for (let topicLog of adjustedTopicLogs) {
      const topicLogMonth = topicLog.date.month()
      if (!topicLogMap.hasOwnProperty(topicLogMonth)) {
        topicLogMap[topicLogMonth] = {}
      }

      topicLogMap[topicLogMonth][topicLog.date.date()] = topicLog
    }

    const focusedTopicLog = topicLogMap[focusedDay.month()]?.[focusedDay.date()]

    return (
      <View style={styles.main}>
        <Calendar
          focusedDay={focusedDay}
          focusDay={this.focusDay}
          month={month}
          topicLogMap={topicLogMap}
        />
        <Line style={{ width: "95%", marginTop: 24 }} />
        <View style={styles.entryInfoContainer}>
          <MText bold h2>
            {focusedDay.format("DD MMMM YYYY")}
          </MText>
          <View style={{ alignItems: "flex-end" }}>
            <MButton
              buttonStyle={styles.entryInfoButton}
              onPress={() =>
                this.props.navigation.navigate("AddEntry", {
                  date: focusedTopicLog?.date ?? focusedDay,
                })
              }
              title={focusedTopicLog ? "Edit" : "Create"}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const topicLogs = state.topic.topicLogs
  const topicLogValueMap = state.topic.topicLogValueMap

  return {
    topicLogs,
    topicLogValueMap,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    topicActions: bindActionCreators(TopicActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Entries))

const styles = StyleSheet.create({
  main: {
    paddingTop: 20,
  },
  entryInfoContainer: {
    padding: 8,
  },
  entryInfoButton: {
    marginVertical: 8,
    marginLeft: 0,
    width: 100,
  },
})
