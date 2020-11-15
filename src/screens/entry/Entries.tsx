import React from "react"
import { StyleSheet, View } from "react-native"
import Calendar from "../../components/calendar/Calendar"

type Props = {}

class Entries extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <View style={styles.main}>
        <Calendar />
      </View>
    )
  }
}

export default Entries

const styles = StyleSheet.create({
  main: {
    paddingTop: 20,
  },
})
