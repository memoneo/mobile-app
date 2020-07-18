import React from "react"
import MText from "./common/MText"
import { StyleSheet } from "react-native"

interface Props {
  title: string
}

const SectionTitle: React.FC<Props> = props => (
  <MText bold h3 style={styles.sectionTitle}>
    {props.title}
  </MText>
)

export default SectionTitle

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: 3,
  },
})
