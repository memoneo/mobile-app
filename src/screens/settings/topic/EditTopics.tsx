import * as React from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import {
  Topic,
  TopicLogDateType,
  SelectionType,
} from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { Audio } from "expo-av"
import Auth from "../../../components/Auth"
import { NavigationInjectedProps, withNavigation } from "react-navigation"

import { UserActions } from "../../../redux/user"
import { RootState } from "../../../redux"
import MPicker from "../../../components/common/MPicker"
import MButton from "../../../components/common/MButton"
import { AddEntryDate } from "../../../types/AddEntry"
import { TopicActions } from "../../../redux/topic"
import MText from "../../../components/common/MText"
import {
  contentDiffColor,
  borderRadius,
  focusedColor,
} from "../../../lib/colors"
import EditTopic from "./EditTopic"
import { SelectionTypeActions } from "../../../redux/selectionType"
import { Icon } from "react-native-elements"
import DraggableFlatList from "react-native-draggable-flatlist"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Picker } from "@react-native-community/picker"

interface OwnProps {}

interface StateProps {
  loading: boolean
  loadingTopic: boolean
  errorTopic: string
  topics: Topic[]
  selectionTypes: SelectionType[]
}

interface DispatchProps {
  topicActions: typeof TopicActions
  userActions: typeof UserActions
  selectionTypeActions: typeof SelectionTypeActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  dateType: TopicLogDateType
  date: AddEntryDate
  showDatePicker: boolean
  dragging: boolean
}

class EditTopics extends React.PureComponent<Props, State> {
  state = {
    dateType: "daily" as TopicLogDateType,
    date: new Date(),
    showDatePicker: false,
    dragging: false,
  }

  sound?: Audio.Sound = null
  recordingData?: Audio.Recording = null

  async componentDidMount() {
    this.props.topicActions.getTopicsRequest()
    this.props.selectionTypeActions.getSelectionTypesRequest()
  }

  getDateType(): TopicLogDateType {
    return this.props.navigation.getParam("dateType") || "daily"
  }

  componentDidUpdate(prevProps: Props) {}

  setDate = (_, date: AddEntryDate) => {
    date = date || this.state.date

    this.setState(
      {
        showDatePicker: false,
        date: date,
      },
      () => {
        this.props.topicActions.getOrCreateTopicLogRequest({
          date,
          dateType: this.state.dateType,
        })
      }
    )
  }

  /**
   * Can be deleted later.
   */
  getCurrentDate = (): AddEntryDate => this.state.date

  render(): JSX.Element {
    const { topics, topicActions, selectionTypes } = this.props
    const { dateType, date, showDatePicker } = this.state

    return (
      <Auth>
        <SafeAreaView style={styles.main}>
          <View style={styles.optionsContainer}>
            <View style={{ flex: 1 }}>
              <MPicker
                selectedValue={dateType}
                enabled={false}
                onValueChange={(value) =>
                  this.setState({ dateType: value as TopicLogDateType })
                }
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Yearly" value="yearly" />
              </MPicker>
            </View>
          </View>
          <View style={styles.header}>
            <MText h4 bold>
              Edit Topics
            </MText>
            <View style={styles.buttonContainer}>
              <Icon
                name="plus"
                type="feather"
                size={8}
                color={focusedColor}
                reverse
                onPress={() =>
                  this.props.navigation.navigate("AddTopic", {
                    dateType: this.getDateType(),
                  })
                }
              />
              <MButton
                buttonStyle={styles.saveButton}
                titleStyle={styles.optionsButtonTitle}
                title="Save"
              />
            </View>
          </View>
          <View style={styles.listContainer}>
            <DraggableFlatList
              data={topics}
              keyExtractor={(topic) => topic.id}
              onDragBegin={() => this.setState({ dragging: true })}
              onDragEnd={({ from, to, data }) =>
                this.setState({ dragging: false }, () => {
                  const topic = topics[from]
                  topicActions.changePriorityTopicRequest({
                    topic,
                    newRank: to,
                    orderedTopics: data,
                  })
                })
              }
              renderItem={({ item, drag, isActive }) => (
                <TouchableOpacity onLongPress={drag}>
                  <EditTopic
                    key={`EditTopic-${item.id}`}
                    topic={item}
                    drag={drag}
                    isDragging={this.state.dragging}
                    isDraggingSelf={isActive}
                    topicActions={topicActions}
                    date={date}
                    dateType={dateType}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Auth>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const loading = state.user.loading || state.topic.loading
  const loadingTopic = state.topic.loading
  const topics = state.topic.topics
  const errorTopic = state.topic.error
  const selectionTypes = Object.values(state.selectionType.selectionTypeMap)

  return {
    loading,
    topics,
    loadingTopic,
    errorTopic,
    selectionTypes,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    topicActions: bindActionCreators(TopicActions, dispatch),
    selectionTypeActions: bindActionCreators(SelectionTypeActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(EditTopics))

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  userInfoContainer: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  userInfoText: {
    textAlign: "center",
    padding: 4,
  },
  listContainer: {
    flex: 1,
  },
  userInfoLogo: {},
  noPermissionsContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionsButton: {
    height: 20,
    width: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    height: 20,
    width: 100,
  },
  plusButton: {
    height: 20,
    width: 45,
    padding: 0,
  },
  plusButtonTitle: {
    padding: 0,
    fontSize: 15,
  },
  plusButtonContainer: {
    padding: 0,
  },
  optionsButtonTitle: {
    fontSize: 11,
  },
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
  topicHeaderText: {},
  actionContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
})
