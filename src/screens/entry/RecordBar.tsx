import { Topic, TopicLogDateType } from "memoneo-common/lib/types"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Icon } from "react-native-elements"
import { TopicRecordMap } from "../../redux/recording"
import { AddEntryDate } from "../../types/AddEntry"

interface RecordContextData {
  playing: string
  recording: string

  topicRecordMap: TopicRecordMap

  canRecord: () => boolean
  startRecording: (topic: Topic) => void
  playRecording: (
    topic: Topic,
    date: AddEntryDate,
    dateType: TopicLogDateType
  ) => void
  stopPlayRecording: () => void
  stopRecording: (body: { topic: Topic }) => void
}

export const RecordContext = React.createContext<RecordContextData>(null)

interface Props {
  topic: Topic
  date: AddEntryDate
  dateType: TopicLogDateType
}

interface State {}

export default class RecordBar extends React.Component<Props, State> {
  static contextType = RecordContext

  render(): JSX.Element {
    const { topic, date, dateType } = this.props
    if (!this.context) {
      return null
    }

    const {
      playing,
      recording,
      playRecording,
      stopPlayRecording,
      stopRecording,
      startRecording,
      canRecord,
      topicRecordMap,
    } = this.context as React.ContextType<typeof RecordContext>

    const isPlaying = !!playing
    const isRecordingTopic = recording.length > 0 && recording === topic.id
    const isRecordingDifferentTopic =
      recording.length > 0 && recording !== topic.id
    const isPlayingTopic = playing.length > 0 && playing === topic.id
    const isPlayingDifferentTopic = playing.length > 0 && playing !== topic.id
    const hasRecording = topicRecordMap.hasOwnProperty(topic.id)

    return (
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
            onPress={() => playRecording(topic, date, dateType)}
          />
        )}
        {isPlaying && (
          <Icon
            name="stop"
            type="foundation"
            reverse
            size={10}
            onPress={() => stopPlayRecording()}
          />
        )}
        {!isRecordingTopic && (
          <Icon
            name="mic"
            type="feather"
            reverse
            disabled={
              isRecordingDifferentTopic ||
              isPlayingTopic ||
              isPlayingDifferentTopic ||
              !canRecord()
            }
            size={10}
            onPress={() => startRecording(topic)}
          />
        )}
        {isRecordingTopic === true && (
          <Icon
            name="stop"
            type="foundation"
            reverse
            size={10}
            onPress={() => stopRecording({ topic })}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topicHeaderIconBar: {
    flexDirection: "row",
  },
})
