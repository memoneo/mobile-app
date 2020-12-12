import * as React from "react"
import { View, StyleSheet } from "react-native"
import {
  Topic,
  TopicLogDateType,
  SelectionType,
  TopicType,
} from "memoneo-common/lib/types"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { MapDispatchToProps, connect, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { Picker } from "@react-native-community/picker"
import EditTopic from "./EditTopic"
import { TopicActions } from "../../../redux/topic"
import { SelectionTypeActions } from "../../../redux/selectionType"
import MText from "../../../components/common/MText"
import MPicker from "../../../components/common/MPicker"
import { RootState } from "../../../redux"

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
    const { selectionTypes, topicActions } = this.props

    const dateType = this.getDateType()

    return (
      <View style={addTopicStyles.main}>
        <View>
          <EditTopic
            mode="add"
            topicActions={topicActions}
            selectionTypes={selectionTypes}
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
