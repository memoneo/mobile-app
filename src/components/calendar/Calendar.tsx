import dayjs from "dayjs"
import React from "react"
import { FlatList, ListRenderItemInfo } from "react-native"

interface Props {}

interface State {
  firstMonthToRender: Date
  months: any[]
  firstViewableIndex: number
  lastViewableIndex: number
  initialScrollIndex: number
  startDate?: Date
  endDate?: Date
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
    firstMonthToRender: new Date(),
    months: [],
    initialScrollIndex: 0,
    startDate: undefined,
    endDate: undefined,
    firstViewableIndex: 0,
    lastViewableIndex: INITIAL_LIST_SIZE + VIEWABLE_RANGE_OFFSET,
  }

  private listReference?: FlatList<any> | null | undefined

  setReference = (ref: any) => {
    if (ref) {
      this.listReference = ref
      //   if (this.props.calendarListRef) {
      //     this.props.calendarListRef(ref)
      //   }
    }
  }

  keyExtractor = (_: any, idx: number): string => String(idx)

  renderMonth({ index }: ListRenderItemInfo<any>): JSX.Element {
    const { firstMonthToRender } = this.state
    const month = dayjs(firstMonthToRender).add(index, "month")

    return null
  }

  render(): JSX.Element {
    return (
      <FlatList
        data={this.state.months}
        renderItem={this.renderMonth}
        keyExtractor={this.keyExtractor}
        ref={this.setReference}
        removeClippedSubviews
        initialScrollIndex={this.state.initialScrollIndex}
      />
    )
  }
}
