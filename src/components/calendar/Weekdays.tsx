import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { secondaryColor } from "../../lib/colors"
import MText from "../common/MText"

const SHOULD_NOT_UPDATE = true

interface WeekColumnProps {
  day: string
}

const WeekColumn = React.memo<WeekColumnProps>(
  (props: WeekColumnProps) => (
    <View style={{ flex: 1, alignItems: "center", marginBottom: 8 }}>
      <MText style={styles.text} allowFontScaling={false}>
        {props.day}
      </MText>
    </View>
  ),
  () => SHOULD_NOT_UPDATE
)

interface WeekColumnsProps {
  days: string[]
}

export default React.memo<WeekColumnsProps>(
  (props: WeekColumnsProps) => (
    <View style={{ flexDirection: "row" }}>
      {props.days.map((day: string) => (
        <WeekColumn key={day} day={day} />
      ))}
    </View>
  ),
  () => SHOULD_NOT_UPDATE
)

const styles = StyleSheet.create({
  text: {
    color: secondaryColor,
    fontSize: 10,
  },
})
