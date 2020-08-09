import * as React from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { Goal } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import Auth from "../../../components/Auth"
import { NavigationInjectedProps, withNavigation } from "react-navigation"

import { RootState } from "../../../redux"
import MButton from "../../../components/common/MButton"
import MText from "../../../components/common/MText"
import {
  contentDiffColor,
  borderRadius,
  focusedColor,
} from "../../../lib/colors"
import EditGoal from "./EditGoal"
import { Icon } from "react-native-elements"
import DraggableFlatList from "react-native-draggable-flatlist"
import { TouchableOpacity } from "react-native-gesture-handler"
import { GoalActions } from "../../../redux/goal"

interface OwnProps {}

interface StateProps {
  loading: boolean
  loadingGoal: boolean
  errorGoal: string
  baseGoals: Goal[]
  subgoalMap: { [key: string]: Goal[] }
}

interface DispatchProps {
  goalActions: typeof GoalActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  dragging: boolean
  showSubgoals: string
}

class EditTopics extends React.PureComponent<Props, State> {
  state = {
    dragging: false,
    showSubgoals: "",
  }

  async componentDidMount() {
    this.props.goalActions.getGoalsRequest()
  }

  showOrToggleSubgoals = (goal: Goal) => {
    if (this.state.showSubgoals === goal.id) {
      this.setState({ showSubgoals: "" })
      return
    }

    this.setState({ showSubgoals: goal.id })
  }

  render(): JSX.Element {
    const { baseGoals, subgoalMap, goalActions } = this.props

    return (
      <Auth>
        <SafeAreaView style={styles.main}>
          <View style={styles.header}>
            <MText h4 bold>
              Edit Goals
            </MText>
            <View style={styles.buttonContainer}>
              <Icon
                name="plus"
                type="feather"
                size={8}
                color={focusedColor}
                reverse
                onPress={() => this.props.navigation.navigate("AddGoal", {})}
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
              data={baseGoals}
              keyExtractor={(goal) => goal.id}
              onDragBegin={() =>
                this.setState({ dragging: true, showSubgoals: "" })
              }
              onDragEnd={({ from, to, data }) =>
                this.setState({ dragging: false }, () => {
                  const goal = baseGoals[from]
                  // TODO TODO TODO TODO
                  goalActions.changePriorityGoalRequest({
                    goal: goal,
                    newRank: to,
                    orderedGoals: data,
                  })
                })
              }
              renderItem={({ item, drag, isActive, index }) => {
                const hasChildren = subgoalMap.hasOwnProperty(item.id)
                const isShowingSubgoals =
                  this.state.showSubgoals && this.state.showSubgoals === item.id

                if (
                  item.parent &&
                  this.state.showSubgoals !== (item.parent as Goal).id
                )
                  return null

                return (
                  <>
                    <EditGoal
                      key={`EditTopic-${item.id}`}
                      goal={item}
                      drag={drag}
                      isDragging={this.state.dragging}
                      isDraggingSelf={isActive}
                      goalActions={goalActions}
                      subgoalMap={subgoalMap}
                      navigation={this.props.navigation}
                    />
                    {hasChildren && !isActive && !this.state.dragging && (
                      <>
                        <MButton
                          buttonStyle={styles.showSubgoalButton}
                          titleStyle={styles.showSubgoalTitle}
                          title={isShowingSubgoals ? "-" : "..."}
                          onPress={() => this.showOrToggleSubgoals(item)}
                        />
                        {!!isShowingSubgoals &&
                          subgoalMap[item.id].map((childGoal) => (
                            <EditGoal
                              key={`EditGoal-child-${childGoal.id}`}
                              goal={childGoal}
                              subgoalMap={subgoalMap}
                              goalActions={goalActions}
                              navigation={this.props.navigation}
                            />
                          ))}
                      </>
                    )}
                  </>
                )
              }}
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
  const loadingTopic = state.goal.loading
  const loading = loadingTopic

  const goals = state.goal.goals
  const baseGoals = goals.filter((goal) => !goal.parent)

  const subgoalMap: { [key: string]: Goal[] } = {}
  for (let goal of goals) {
    if (goal.parent) {
      const parentId = (goal.parent as Goal).id
      if (!subgoalMap.hasOwnProperty(parentId)) subgoalMap[parentId] = []
      subgoalMap[parentId].push(goal)
    }
  }

  const errorTopic = state.goal.error

  return {
    loading,
    baseGoals,
    subgoalMap,
    loadingGoal: loadingTopic,
    errorGoal: errorTopic,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    goalActions: bindActionCreators(GoalActions, dispatch),
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
  showSubgoalButton: {
    height: 20,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  showSubgoalTitle: {
    fontSize: 10,
  },
})
