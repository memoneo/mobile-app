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
import RecordBar from "./RecordBar"
import { Dayjs } from "dayjs"

interface Props {
  topic: Topic
  topicLog: TopicLog
  topicActions: typeof TopicActions
  value?: TopicLogValue
  persons: Person[]
  goals: Goal[]
  date: Dayjs
  dateType: TopicLogDateType
}

interface State {
  topicContainerStyles: StyleProp<ViewStyle>[]
  hideValue: boolean
}

class AddEntryTopicContainer extends React.PureComponent<Props, State> {
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
      dateType,
      topicActions,
      topicLog,
      date,
      value,
    } = this.props
    const { topicContainerStyles, hideValue } = this.state

    return (
      <View
        style={StyleSheet.flatten([
          styles.topicContainer,
          ...topicContainerStyles,
        ])}
        key={`topic-${topic.id}`}>
        <View style={styles.topicHeader}>
          <MText
            style={styles.topicHeaderText}
            key={`topic-text-${topic.id}`}
            onPress={this.onHeaderTextPress}>
            {formatTopicName(topic, dateType)}
          </MText>
          {topic.hasVoice && (
            <RecordBar topic={topic} date={date} dateType={dateType} />
          )}
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
  topicHeaderText: {
    width: 220,
  },
})
