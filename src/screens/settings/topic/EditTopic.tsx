import * as React from "react"
import { View, StyleSheet, Alert } from "react-native"
import {
  Topic,
  TopicLogDateType,
  SelectionType,
  TopicTypeInfo,
  TopicType,
} from "memoneo-common/lib/types"
import { formatTopicName } from "../../../lib/format"
import {
  contentDiffColor,
  borderRadius,
  RATING_5_COLOR,
} from "../../../lib/colors"
import { TopicActions } from "../../../redux/topic"
import EditTopicText from "./EditTopicText"
import EditTopicPersonSelection from "./EditTopicPersonSelection"
import EditTopicSelection from "./EditTopicSelection"
import EditTopicGoalSelection from "./EditTopicGoal"
import { BasicFormValues } from "./EditBasicFields"

export type TopicSettingsMode = "edit" | "add"

export interface EditTopicProps {
  topic?: Topic
  topicActions: typeof TopicActions
  dateType: TopicLogDateType
  mode: TopicSettingsMode
  selectionTypes?: SelectionType[]
  drag?: () => void
  isDragging?: boolean
  isDraggingSelf?: boolean
}

interface State {
  type: TopicType
}

class EditTopic extends React.PureComponent<EditTopicProps, State> {
  constructor(props: EditTopicProps) {
    super(props)

    this.state = {
      type: props.topic?.typeInfo.type ?? "text-simple",
    }
  }

  deleteTopic = () => {
    const { mode, topicActions, topic, dateType } = this.props

    if (mode === "add") {
      return
    }

    if (!topic) {
      console.warn("Topic should never be undefined in deleteTopic")
      return
    }

    if (topic.deleted) {
      Alert.alert(
        "Hard delete Topic",
        "Hard deleting is not yet activated, sorry.",
        [{ text: "OK" }]
      )
    } else {
      Alert.alert(
        "Delete Topic",
        `Please confirm deleting topic "${formatTopicName(topic, dateType)}".`,
        [
          { text: "Cancel" },
          {
            text: "OK",
            onPress: () => {
              topicActions.deleteTopicRequest({ topic })
            },
          },
        ]
      )
    }
  }

  updateType = (type: TopicType) => this.setState({ type })

  render(): JSX.Element {
    const { topic, isDragging } = this.props

    const containerStyles: any[] = [styles.topicContainer]
    if (topic?.deleted ?? false) {
      containerStyles.push(styles.topicContainerDeleted)
    }
    if (isDragging) {
      containerStyles.push(styles.topicContainerDragging)
    }

    return (
      <View
        style={StyleSheet.flatten(containerStyles)}
        key={`topic-${topic?.id ?? "add"}`}>
        <EditTopicInner
          {...this.props}
          deleteTopic={this.deleteTopic}
          type={this.state.type}
          updateType={this.updateType}
        />
      </View>
    )
  }
}

interface EditTopicInnerProps extends EditTopicProps {
  type: TopicType
  deleteTopic: () => void
  updateType: (type: TopicType) => void
}

export interface EditTopicInnerSubProps extends EditTopicInnerProps {
  submitUpdate: (toUpdate: Partial<Topic>) => void
  submitCreateTopicFromValues: (values: BasicFormValues) => void
  submitCreateTopic: (topic: Topic) => void
  changeType: (type: TopicType) => void
}

function EditTopicInner(props: EditTopicInnerProps): JSX.Element {
  function createTopicFromValues(values: BasicFormValues) {
    if (props.mode === "edit") {
      return
    }

    const typeInfo: TopicTypeInfo = {
      type: props.type,
    }

    const topic: Topic = {
      id: "",
      name: values.name,
      description: "",
      optional: values.optional,
      deleted: false,
      typeInfo,
      hasVoice: values.hasVoice,
    }

    createTopic(topic)
  }

  function createTopic(topic: Topic) {
    if (props.mode === "edit") {
      return
    }

    props.topicActions.createTopicRequest({ topic })
  }

  function updateTopic(toUpdate: Partial<Topic>) {
    const newTopic = { ...props.topic, ...toUpdate }

    props.topicActions.updateTopicRequest({ topic: newTopic })
  }

  switch (props.topic?.typeInfo.type ?? props.type) {
    case "text-simple":
      return (
        <EditTopicText
          {...props}
          submitUpdate={updateTopic}
          submitCreateTopicFromValues={createTopicFromValues}
          submitCreateTopic={createTopic}
          changeType={props.updateType}
        />
      )
    case "text-5rated":
      return (
        <EditTopicText
          {...props}
          submitUpdate={updateTopic}
          submitCreateTopicFromValues={createTopicFromValues}
          submitCreateTopic={createTopic}
          changeType={props.updateType}
        />
      )
    case "selection":
      return (
        <EditTopicSelection
          {...props}
          selectionTypes={props.selectionTypes ?? []}
          submitUpdate={updateTopic}
          submitCreateTopicFromValues={createTopicFromValues}
          submitCreateTopic={createTopic}
          changeType={props.updateType}
        />
      )
    case "person-selection":
      return (
        <EditTopicPersonSelection
          {...props}
          submitUpdate={updateTopic}
          submitCreateTopicFromValues={createTopicFromValues}
          submitCreateTopic={createTopic}
          changeType={props.updateType}
        />
      )
    case "goal-selection":
      return (
        <EditTopicGoalSelection
          {...props}
          submitUpdate={updateTopic}
          submitCreateTopicFromValues={createTopicFromValues}
          submitCreateTopic={createTopic}
          changeType={props.updateType}
        />
      )
  }
}

export default EditTopic

const styles = StyleSheet.create({
  topicContainer: {
    padding: 10,
    backgroundColor: contentDiffColor,
    borderRadius: borderRadius,
    marginVertical: 8,
    justifyContent: "center",
    position: "relative",
  },
  topicContainerDeleted: {
    backgroundColor: RATING_5_COLOR,
  },
  topicContainerDragging: {},
})
