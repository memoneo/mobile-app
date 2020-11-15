import dayjs, { Dayjs } from "dayjs"
import React from "react"
import { StyleSheet, View } from "react-native"
import Line from "../common/Line"
import MText from "../common/MText"
import Month from "./Month"

interface Props {}

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

export default class Calendar extends React.Component<Props, State> {
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
  }

  render(): JSX.Element {
    const { firstMonthToRender } = this.state
    const month = dayjs(firstMonthToRender).add(0, "month")

    return (
      <View style={styles.container}>
        <Month month={month} />
        <Line style={{ width: "95%", marginTop: 24 }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
})
