import React from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import MText from "../common/MText"
import { DayType } from "../../lib/month"

interface Props {
  day: DayType
}

export default class Day extends React.Component<Props> {
  render(): JSX.Element {
    const { day } = this.props

    return (
      <TouchableOpacity>
        <MText>{day}</MText>
      </TouchableOpacity>
    )
  }
}
