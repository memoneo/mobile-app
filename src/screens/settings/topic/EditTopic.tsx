import * as React from "react"
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ViewProps,
  Alert,
} from "react-native"
import { Topic, TopicLogDateType, Person } from "memoneo-common/lib/types"
import MText from "../../../components/common/MText"
import { formatTopicName } from "../../../lib/format"
import { Icon } from "react-native-elements"
import { AddEntryDate } from "../../../types/AddEntry"
import {
  contentDiffColor,
  borderRadius,
  RATING_5_COLOR,
} from "../../../lib/colors"
import { TopicActions } from "../../../redux/topic"
import MInput from "../../../components/common/MInput"
import { Formik } from "formik"
import { Yup } from "../../../lib/reexports"
import EditTopicText from "./EditTopicText"
import EditTopicPersonSelection from "./EditTopicPersonSelection"
import EditTopicSelection from "./EditTopicSelection"
import { TouchableHighlight } from "react-native-gesture-handler"

export interface EditTopicProps {
  topic: Topic
  topicActions: typeof TopicActions
  date: AddEntryDate
  dateType: TopicLogDateType
  drag: () => void
  isDragging: boolean
  isDraggingSelf: boolean
}

interface State {}

interface FormProps {
  name: string
  description?: string
}

const EditTopicSchema = Yup.object().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
})

class EditTopic extends React.Component<EditTopicProps, State> {
  constructor(props: EditTopicProps) {
    super(props)

    this.state = {}
  }

  deleteTopic = () => {
    const { topicActions, topic, dateType } = this.props

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

  handleSubmit = (values: FormProps) => {}

  render(): JSX.Element {
    const { topic, dateType, topicActions, isDragging } = this.props

    const containerStyles: any[] = [styles.topicContainer]
    if (topic.deleted) {
      containerStyles.push(styles.topicContainerDeleted)
    }
    if (isDragging) {
      containerStyles.push(styles.topicContainerDragging)
    }

    return (
      <View
        style={StyleSheet.flatten(containerStyles)}
        key={`topic-${topic.id}`}>
        <EditTopicInner {...this.props} deleteTopic={this.deleteTopic} />
      </View>
    )
  }
}

interface EditTopicInnerProps extends EditTopicProps {
  deleteTopic: () => void
}

export interface EditTopicInnerSubProps extends EditTopicInnerProps {
  submit: (toUpdate: Partial<Topic>) => void
}

function EditTopicInner(props: EditTopicInnerProps): JSX.Element {
  function submit(toUpdate: Partial<Topic>) {
    const newTopic = { ...props.topic, ...toUpdate }

    props.topicActions.updateTopicRequest({ topic: newTopic })
  }

  switch (props.topic.typeInfo.type) {
    case "text-simple":
      return <EditTopicText {...props} submit={submit} />
    case "text-5rated":
      return <EditTopicText {...props} submit={submit} />
    case "selection":
      return <EditTopicSelection {...props} submit={submit} />
    case "person-selection":
      return <EditTopicPersonSelection {...props} submit={submit} />
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
