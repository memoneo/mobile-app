import dayjs, { Dayjs } from "dayjs"
import { TopicLogWithDatesAsDayJs } from "memoneo-common/lib/types"
import React from "react"
import { StyleSheet, View } from "react-native"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import { TopicActions, TopicLogValueMap } from "../../redux/topic"
import Line from "../common/Line"
import MText from "../common/MText"
import Month from "./Month"

interface OwnProps {}

interface StateProps {
  // loading: boolean
  // error: string
  topicLogs: TopicLogWithDatesAsDayJs[]
  topicLogValueMap: TopicLogValueMap
}

interface DispatchProps {
  topicActions: typeof TopicActions
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  firstMonthToRender: Dayjs
  months: any[]
  firstViewableIndex: number
  lastViewableIndex: number
  initialScrollIndex: number
  startDate?: Dayjs
  endDate?: Dayjs
}

const NUMBER_OF_MONTHS = 12
const MONTH_HEIGHT = 370
const INITIAL_LIST_SIZE = 2
const VIEWABLE_RANGE_OFFSET = 5

const VIEWABILITY_CONFIG = {
  waitForInteraction: true,
  itemVisiblePercentThreshold: 10,
  minimumViewTime: 32,
}

export interface CalendarTopicLogMap {
  [key: number]: { [key: number]: TopicLogWithDatesAsDayJs }
}

class Calendar extends React.Component<Props, State> {
  state = {
    firstMonthToRender: dayjs(new Date()),
    months: [],
    initialScrollIndex: 0,
    startDate: undefined,
    endDate: undefined,
    firstViewableIndex: 0,
    lastViewableIndex: INITIAL_LIST_SIZE + VIEWABLE_RANGE_OFFSET,
  }

  componentDidMount() {
    this.setState({ months: [0] })

    if (this.props.topicLogs.length === 0) {
      this.props.topicActions.getTopicLogsRequest()
    }
  }

  render(): JSX.Element {
    const { firstMonthToRender } = this.state
    const { topicLogs } = this.props

    const month = dayjs(firstMonthToRender).add(0, "month")

    const topicLogMap: CalendarTopicLogMap = {}
    const adjustedTopicLogs = topicLogs.filter((topicLog) => {
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

    return (
      <View style={styles.container}>
        <Month month={month} topicLogMap={topicLogMap} />
        <Line style={{ width: "95%", marginTop: 24 }} />
      </View>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const topicLogs = state.topic.topicLogs
  const topicLogValueMap = state.topic.topicLogValueMap

  return {
    topicLogs,
    topicLogValueMap,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    topicActions: bindActionCreators(TopicActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Calendar)

const styles = StyleSheet.create({
  container: {},
})
