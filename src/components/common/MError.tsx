import * as React from "react"
import MText from "./MText"
import { TextStyle, StyleProp, StyleSheet } from "react-native"

interface OwnProps {
  text: string
  textStyle?: StyleProp<TextStyle>
}

const MError: React.FC<OwnProps> = props => (
  <MText style={StyleSheet.flatten([{ color: "red" }, props.textStyle])}>
    {props.text}
  </MText>
)

export default MError
