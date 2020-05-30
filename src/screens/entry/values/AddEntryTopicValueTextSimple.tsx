import * as React from "react"
import { View, StyleSheet } from "react-native"
import { TopicLogValueTextSimple } from "memoneo-common/lib/types"
import MInput from "../../../components/common/MInput"
import { AddEntryTopicValueInnerProps } from "./AddEntryTopicValue"

interface Props extends AddEntryTopicValueInnerProps {
  value?: TopicLogValueTextSimple
}

interface State {
  text: string
}

class AddEntryTopicValueTextSimple extends React.Component<Props, State> {
  state = {
    text: "",
  }

  componentDidMount() {
    this.updateStateAfterValueUpdate()
  }

  /**
   * Update the state when a new value prop has been passed through the request of the values for a
   * This request may for example be triggered by selecting a new day.
   *
   * @param prevProps
   */
  componentDidUpdate(prevProps: Props) {
    if (prevProps && prevProps.value !== this.props.value) {
      this.updateStateAfterValueUpdate()
    }
  }

  updateStateAfterValueUpdate = () => {
    const text = this.getDefaultTextValue()

    this.setState({ text })
  }

  getDefaultTextValue = () => (this.props.value ? this.props.value.text : "")

  handleEndEditing = () => this.props.saveValue({ text: this.state.text })

  render(): JSX.Element {
    const defaultText = this.getDefaultTextValue()
    const { text } = this.state

    return (
      <View>
        <MInput
          style={styles.textInput}
          multiline
          defaultValue={defaultText}
          value={text}
          numberOfLines={4}
          onChangeText={(newText: string) => this.setState({ text: newText })}
          onEndEditing={this.handleEndEditing}
        />
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  textInput: {
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
  },
})

export default AddEntryTopicValueTextSimple
