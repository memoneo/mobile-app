import React from "react"
import Month from "./Month"

interface Props {
  month: number
  year: number
}

interface State {}

export default class MonthWrapper extends React.Component<Props, State> {
  render(): JSX.Element {
    const { month, year } = this.props

    return <Month month={month} year={year} />
  }
}
