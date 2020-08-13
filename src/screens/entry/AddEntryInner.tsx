import React from "react"
import {
  Topic,
  TopicLog,
  Person,
  Goal,
  TopicLogDateType,
} from "memoneo-common/lib/types"
import { TopicActions, TopicLogValueMap } from "../../redux/topic"
import { TopicRecordMap } from "../../redux/recording"
import AddEntryTopicContainer from "./AddEntryTopicContainer"
import { AddEntryDate } from "../../types/AddEntry"
import { Dayjs } from "dayjs"

interface Props {
  topic: Topic
  recording: string
  playing: string
  topicLog: TopicLog
  topicActions: typeof TopicActions
  persons: Person[]
  goals: Goal[]
  date: AddEntryDate
  topicRecordMap: TopicRecordMap
  topicLogValueMap: TopicLogValueMap
  dateType: TopicLogDateType
  canRecord: () => boolean
  startRecording: (topic: Topic) => void
  playRecording: (topic: Topic, date: AddEntryDate, dateType: TopicLogDateType) => void
  stopPlayRecording: () => void
  stopRecording: (body: { topic: Topic }) => void
}

const AddEntryInner: React.FC<Props> = React.memo(
  ({
    topic,
    recording,
    playing,
    topicRecordMap,
    topicLogValueMap,
    topicLog,
    topicActions,
    persons,
    goals,
    date,
    dateType,
    canRecord,
    startRecording,
    playRecording,
    stopPlayRecording,
    stopRecording
  }) => {
    const isRecordingTopic = recording.length > 0 && recording === topic.id
    const isRecordingDifferentTopic =
      recording.length > 0 && recording !== topic.id
    const isPlayingTopic = playing.length > 0 && playing === topic.id
    const isPlayingDifferentTopic = playing.length > 0 && playing !== topic.id
    const hasRecording = topicRecordMap.hasOwnProperty(topic.id)

    const outerValue = topicLogValueMap[topic.id]
    const innerValue = outerValue ? outerValue.value : undefined
    return (
      <AddEntryTopicContainer
        key={`add-entry-topic-${topic.id}`}
        topic={topic}
        topicLog={topicLog}
        topicActions={topicActions}
        persons={persons}
        goals={goals}
        date={date}
        dateType={dateType}
        value={innerValue}
        canRecord={canRecord()}
        isRecordingTopic={isRecordingTopic}
        isRecordingDifferentTopic={isRecordingDifferentTopic}
        isPlaying={isPlayingTopic}
        isPlayingDifferentTopic={isPlayingDifferentTopic}
        hasRecording={hasRecording}
        startRecording={() => startRecording(topic)}
        playRecording={() => playRecording(topic, date, dateType)}
        stopPlayRecording={() => stopPlayRecording()}
        stopRecording={() => stopRecording({ topic })}
      />
    )
  }
)

export default AddEntryInner
