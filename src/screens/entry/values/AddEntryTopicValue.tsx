import * as React from "react"
import {
  Topic,
  TopicLog,
  TopicLogValue,
  TopicLogValueTextSimple,
  TopicLogValueTextFiveRated,
  TopicLogValueSelection,
  TopicLogValueContainer,
  Person,
  TopicLogValuePersonSelection,
} from "memoneo-common/lib/types"
import AddEntryTopicValueTextRated from "./AddEntryTopicValueTextRated"
import AddEntryTopicValueTextSimple from "./AddEntryTopicValueTextSimple"
import AddEntryTopicValueSelection from "./AddEntryTopicValueSelection"
import AddEntryTopicValuePersonSelection from "./AddEntryTopicValuePersonSelection"
import { TopicActions } from "../../../redux/topic"
import { StyleProp, ViewStyle } from "react-native"

interface Props {
  topic: Topic
  topicLog: TopicLog
  persons: Person[]
  value?: TopicLogValue
  topicActions: typeof TopicActions
  setTopicContainerStyles: (styles: StyleProp<ViewStyle>[]) => void
}

export interface AddEntryTopicValueInnerProps {
  topic: Topic
  topicLog: TopicLog
  value?: TopicLogValue
  saveValue: (value: TopicLogValue) => void
}

const AddEntryTopicValue: React.FC<Props> = props => {
  const {
    topic,
    topicLog,
    persons,
    value,
    topicActions,
    setTopicContainerStyles,
  } = props

  function saveValue(value: TopicLogValue) {
    topicActions.createOrUpdateTopicLogValueRequest({ topic, topicLog, value })
  }

  switch (props.topic.typeInfo.type) {
    case "text-simple":
      return (
        <AddEntryTopicValueTextSimple
          topic={topic}
          topicLog={topicLog}
          value={value as TopicLogValueTextSimple}
          saveValue={saveValue}
        />
      )
    case "text-5rated":
      return (
        <AddEntryTopicValueTextRated
          topic={topic}
          topicLog={topicLog}
          value={value as TopicLogValueTextFiveRated}
          ratedType="5rated"
          saveValue={saveValue}
          setTopicContainerStyles={setTopicContainerStyles}
        />
      )
    case "selection":
      if (!props.topic.typeInfo.data) {
        console.warn(`Received typeInfo for topic ${topic.name} with no data`)
        return null
      }

      return (
        <AddEntryTopicValueSelection
          topic={topic}
          topicLog={topicLog}
          value={value as TopicLogValueSelection}
          saveValue={saveValue}
        />
      )
    case "person-selection":
      return (
        <AddEntryTopicValuePersonSelection
          topic={topic}
          topicLog={topicLog}
          value={value as TopicLogValuePersonSelection}
          persons={persons}
          saveValue={saveValue}
        />
      )
    default:
      throw Error(`Found invalid topic type ${topic.typeInfo.type}`)
  }
}

export default AddEntryTopicValue
