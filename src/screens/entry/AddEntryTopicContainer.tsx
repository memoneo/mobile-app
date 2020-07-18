import * as React from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import {
  Topic,
  TopicLogDateType,
  TopicLog,
  TopicLogValue,
  Person,
  Goal,
} from "memoneo-common/lib/types"
import MText from "../../components/common/MText"
import { formatTopicName } from "../../lib/format"
import { Icon } from "react-native-elements"
import { AddEntryDate } from "../../types/AddEntry"
import { contentDiffColor, borderRadius } from "../../lib/colors"
import AddEntryTopicValue from "./values/AddEntryTopicValue"
import { TopicActions } from "../../redux/topic"

interface Props {
  topic: Topic
  topicLog: TopicLog
  topicActions: typeof TopicActions
  value?: TopicLogValue
  persons: Person[]
  goals: Goal[]
  date: AddEntryDate
  dateType: TopicLogDateType
  hasRecording: boolean
  canRecord: boolean
  isPlaying: boolean
  isPlayingDifferentTopic: boolean
  isRecordingTopic: boolean
  isRecordingDifferentTopic: boolean
  startRecording: () => void
  playRecording: () => void
  stopPlayRecording: () => void
  stopRecording: () => void
}

interface State {
  topicContainerStyles: StyleProp<ViewStyle>[]
  hideValue: boolean
}

class AddEntryTopicContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      topicContainerStyles: [],
      hideValue: props.topic.optional,
    }
  }

  setTopicContainerStyles = (styles: StyleProp<ViewStyle>[]) =>
    this.setState({
      topicContainerStyles: styles,
    })

  private _removeTopicContainerStyle = (style: StyleProp<ViewStyle>) => {
    const newStyles = [...this.state.topicContainerStyles]
    const idx = newStyles.indexOf(style)
    if (idx !== -1) {
      newStyles.splice(idx)

      this.setState({ topicContainerStyles: newStyles })
    }
  }

  onHeaderTextPress = () => {
    const { topic } = this.props

    if (topic.optional) {
      const { hideValue } = this.state

      this.setState({ hideValue: !hideValue })
    }
  }

  render(): JSX.Element {
    const {
      topic,
      persons,
      goals,
      isPlaying,
      dateType,
      hasRecording,
      isPlayingDifferentTopic,
      isRecordingDifferentTopic,
      isRecordingTopic,
      playRecording,
      canRecord,
      startRecording,
      stopPlayRecording,
      stopRecording,
      topicActions,
      topicLog,
      value,
    } = this.props
    const { topicContainerStyles, hideValue } = this.state

    return (
      <View
        style={StyleSheet.flatten([
          styles.topicContainer,
          ...topicContainerStyles,
        ])}
        key={`topic-${topic.id}`}
      >
        <View style={styles.topicHeader}>
          <MText
            style={styles.topicHeaderText}
            key={`topic-text-${topic.id}`}
            onPress={this.onHeaderTextPress}
          >
            {formatTopicName(topic, dateType)}
          </MText>
          <View style={styles.topicHeaderIconBar}>
            {!isPlaying && (
              <Icon
                name="play"
                type="foundation"
                reverse
                size={10}
                disabled={
                  !hasRecording ||
                  isPlayingDifferentTopic ||
                  isRecordingDifferentTopic ||
                  isRecordingTopic
                }
                onPress={playRecording}
              />
            )}
            {isPlaying && (
              <Icon
                name="stop"
                type="foundation"
                reverse
                size={10}
                onPress={stopPlayRecording}
              />
            )}
            {!isRecordingTopic && (
              <Icon
                name="mic"
                type="feather"
                reverse
                disabled={
                  isRecordingDifferentTopic ||
                  isPlaying ||
                  isPlayingDifferentTopic ||
                  !canRecord
                }
                size={10}
                onPress={startRecording}
              />
            )}
            {isRecordingTopic === true && (
              <Icon
                name="stop"
                type="foundation"
                reverse
                size={10}
                onPress={stopRecording}
              />
            )}
          </View>
        </View>
        {!hideValue && (
          <AddEntryTopicValue
            topic={topic}
            topicLog={topicLog}
            value={value}
            persons={persons}
            goals={goals}
            topicActions={topicActions}
            setTopicContainerStyles={this.setTopicContainerStyles}
          />
        )}
      </View>
    )
  }
}

export default AddEntryTopicContainer

const styles = StyleSheet.create({
  topicContainer: {
    padding: 10,
    backgroundColor: contentDiffColor,
    borderRadius: borderRadius,
    marginVertical: 8,
    justifyContent: "center",
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicHeaderIconBar: {
    flexDirection: "row",
  },
  topicHeaderText: {
    width: 220,
  },
})
