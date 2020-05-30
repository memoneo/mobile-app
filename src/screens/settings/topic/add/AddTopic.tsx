import * as React from "react"
import { View, StyleSheet, Picker } from "react-native"
import {
  Topic,
  TopicLogDateType,
  SelectionType,
  TopicType,
} from "memoneo-common/lib/types"
import { contentDiffColor, borderRadius } from "../../../../lib/colors"
import { TopicActions } from "../../../../redux/topic"
import { AddEntryDate } from "../../../../types/AddEntry"
import AddTopicText from "./AddTopicText"
import AddTopicSelection from "./AddTopicSelection"
import AddTopicPersonSelection from "./AddTopicPersonSelection"
import MPicker from "../../../../components/common/MPicker"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { SelectionTypeActions } from "../../../../redux/selectionType"
import MText from "../../../../components/common/MText"
import { MapDispatchToProps, connect, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../../../redux"

interface OwnProps {}

interface DispatchProps {
  topicActions: typeof TopicActions
  selectionTypeActions: typeof SelectionTypeActions
}

interface StateProps {
  selectionTypes: SelectionType[]
  errorCreate: string
  loadingCreate: boolean
}

export type AddTopicProps = OwnProps &
  StateProps &
  DispatchProps &
  NavigationInjectedProps

interface State {
  topicType: TopicType
}

class AddTopic extends React.Component<AddTopicProps, State> {
  state = {
    topicType: "text-simple" as TopicType,
  }

  componentDidMount() {
    this.props.selectionTypeActions.getSelectionTypesRequest()
  }

  componentDidUpdate(oldProps: AddTopicProps) {
    if (
      oldProps.loadingCreate &&
      !this.props.loadingCreate &&
      !this.props.errorCreate
    ) {
      this.props.navigation.navigate("Topic", { dateType: this.getDateType() })
    }
  }

  getDateType(): TopicLogDateType {
    return this.props.navigation.getParam("dateType")
  }

  render(): JSX.Element {
    const dateType = this.getDateType()

    const containerStyles: any[] = [addTopicStyles.topicContainer]

    return (
      <View style={addTopicStyles.main}>
        <MText h4 bold>
          Add Topic 
        </MText>
        <View style={StyleSheet.flatten(containerStyles)}>
          <MPicker
            selectedValue={this.state.topicType}
            onValueChange={(value: TopicType) =>
              this.setState({ topicType: value })
            }>
            <Picker.Item label="Text Simple" value="text-simple" />
            <Picker.Item label="Text Rated" value="text-5rated" />
            <Picker.Item label="Selection" value="selection" />
            <Picker.Item label="Person Selection" value="person-selection" />
          </MPicker>
          <AddTopicInner
            {...this.props}
            topicType={this.state.topicType}
            dateType={dateType}
          />
        </View>
      </View>
    )
  }
}

export interface AddTopicInnerProps extends AddTopicProps {
  topicType: TopicType
  dateType: TopicLogDateType
}

export interface AddTopicInnerSubProps extends AddTopicProps {
  submit: (toUpdate: Partial<Topic>) => void
}

function AddTopicInner(props: AddTopicInnerProps): JSX.Element {
  function submit(toUpdate: Partial<Topic>) {
    const newTopic = { ...toUpdate }

    props.topicActions.createTopicRequest({ topic: newTopic })
  }

  switch (props.topicType) {
    case "text-simple":
      return <AddTopicText {...props} submit={submit} typeName="text-simple" />
    case "text-5rated":
      return <AddTopicText {...props} submit={submit} typeName="text-5rated" />
    case "selection":
      return (
        <AddTopicSelection
          {...props}
          submit={submit}
          typeName="selection"
          selectionTypes={props.selectionTypes}
        />
      )
    case "person-selection":
      return (
        <AddTopicPersonSelection
          {...props}
          submit={submit}
          typeName="person-selection"
        />
      )
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const loading = state.user.loading || state.topic.loading
  const loadingTopic = state.topic.loading
  const errorTopic = state.topic.error
  const errorCreate = state.topic.errorCreate
  const loadingCreate = state.topic.loadingCreate
  const selectionTypes = Object.values(state.selectionType.selectionTypeMap)

  return {
    loading,
    loadingTopic,
    errorTopic,
    errorCreate,
    selectionTypes,
    loadingCreate,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    topicActions: bindActionCreators(TopicActions, dispatch),
    selectionTypeActions: bindActionCreators(SelectionTypeActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(AddTopic))

export const addTopicStyles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  topicContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: contentDiffColor,
    borderRadius: borderRadius,
    marginVertical: 8,
    justifyContent: "center",
    position: "relative",
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
    flex: 1,
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
  addButton: {
    height: 20,
    width: 100,
  },
  optionsButtonTitle: {
    fontSize: 11,
  },
  addButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
})
