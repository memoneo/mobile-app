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
import { Dayjs } from "dayjs"

interface Props {
  topic: Topic
  topicLog: TopicLog
  topicActions: typeof TopicActions
  persons: Person[]
  goals: Goal[]
  date: Dayjs
  topicRecordMap: TopicRecordMap
  topicLogValueMap: TopicLogValueMap
  dateType: TopicLogDateType
}

const AddEntryInner: React.FC<Props> = React.memo(
  ({
    topic,
    topicLogValueMap,
    topicLog,
    topicActions,
    persons,
    goals,
    date,
    dateType,
  }) => {
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
      />
    )
  }
)

export default AddEntryInner
