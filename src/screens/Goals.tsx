import * as React from "react"
import { View, StyleSheet, Modal } from "react-native"
import Auth from "../components/Auth"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { User, Goal, GoalStatus } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import LinearGradient from "react-native-linear-gradient"
import { RootState } from "../redux"
import MText from "../components/common/MText"
import { GoalActions } from "../redux/goal"
import { colors, borderRadius, positiveColor } from "../lib/colors"
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler"
import { Slider } from "react-native-elements"
import MButton from "../components/common/MButton"
import { modalStyles } from "../lib/styleVars"
import MPicker from "../components/common/MPicker"
import { Picker } from "@react-native-community/picker"
import MBadge from "../components/common/MBadge"

interface OwnProps {}

interface GoalContainer {
  inner: Goal
  children: Goal[]
}

interface StateProps {
  ownUser?: User
  loading: boolean
  error: string
  goals: GoalContainer[]
}

interface DispatchProps {
  goalActions: typeof GoalActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  editingGoal: Goal | null
  goalProgressSliderValue: number
  status: GoalStatus
  showNonActive: boolean
  hideCompleted: boolean
}

class Goals extends React.PureComponent<Props, State> {
  state: State = {
    editingGoal: null,
    goalProgressSliderValue: 0,
    status: "active",
    showNonActive: false,
    hideCompleted: true,
  }

  componentDidMount() {
    this.props.goalActions.getGoalsRequest()
  }

  getLowerProgressBound = (progress: number): number => Math.max(5, progress)
  getUpperProgressBound = (progress: number): number =>
    Math.min(95, 100 - progress)

  updateGoalDataAndCloseModal = () => {
    const goal = this.state.editingGoal

    const { goalProgressSliderValue, status } = this.state

    const newGoal = { ...goal }
    newGoal.progress = goalProgressSliderValue
    newGoal.status = status

    this.props.goalActions.updateGoalRequest({ goal: newGoal })

    this.closeModal()
  }

  closeModal = () => this.setState({ editingGoal: null })

  activateModal = (goal: Goal) =>
    this.setState({
      editingGoal: goal,
      goalProgressSliderValue: goal.progress,
      status: goal.status,
    })

  isGoalShown = (goal: Goal): boolean =>
    !goal.deleted &&
    (!this.state.hideCompleted ||
      (this.state.hideCompleted && goal.progress < 100)) &&
    (this.state.showNonActive ||
      (!this.state.showNonActive && goal.status === "active"))

  render(): JSX.Element {
    const { goals } = this.props
    const { editingGoal, goalProgressSliderValue, status } = this.state

    const modalVisible = !!editingGoal

    return (
      <Auth>
        <View style={styles.main}>
          <View style={styles.header}>
            <MText h2 bold>
              Goals
            </MText>
            <View style={styles.headerButtons}>
              <MButton
                buttonStyle={styles.headerButtonStyle}
                titleStyle={styles.headerButtonTextStyle}
                title="Hide completed"
                type={this.state.hideCompleted ? "solid" : "outline"}
                onPress={() =>
                  this.setState({ hideCompleted: !this.state.hideCompleted })
                }
              />
              <MButton
                buttonStyle={styles.headerButtonStyle}
                titleStyle={styles.headerButtonTextStyle}
                title="Show non-active"
                type={this.state.showNonActive ? "solid" : "outline"}
                onPress={() =>
                  this.setState({ showNonActive: !this.state.showNonActive })
                }
              />
            </View>
          </View>
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
          >
            <View style={modalStyles.modalView}>
              <MText bold>Progress</MText>
              <MText>{goalProgressSliderValue}% done</MText>
              <Slider
                value={goalProgressSliderValue}
                style={styles.slider}
                minimumValue={0}
                step={5}
                maximumValue={100}
                thumbTintColor={positiveColor}
                minimumTrackTintColor={positiveColor}
                onValueChange={(progress) =>
                  this.setState({ goalProgressSliderValue: progress })
                }
              />
              <MText bold>Status</MText>
              <MPicker
                selectedValue={status}
                style={{ width: 200 }}
                onValueChange={(value) =>
                  this.setState({ status: value as GoalStatus })
                }
              >
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="On hold" value="on_hold" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </MPicker>
              <MButton title="Ok" onPress={this.updateGoalDataAndCloseModal} />
            </View>
          </Modal>
          <ScrollView style={{}}>
            {goals
              .filter((goal) => this.isGoalShown(goal.inner))
              .map((goal) => (
                <View key={`goal-${goal.inner.id}-view`} style={{}}>
                  <View style={styles.goalTitle}>
                    <TouchableHighlight
                      style={styles.goalBadge}
                      key={`goal-badge-${goal.inner.id}`}
                      onPress={() => this.activateModal(goal.inner)}
                    >
                      <MText bold style={styles.goalText}>
                        {goal.inner.name}
                      </MText>
                    </TouchableHighlight>
                    <View style={styles.gradientContainer}>
                      <View
                        style={StyleSheet.flatten([
                          styles.gradient1,
                          {
                            width: `${this.getLowerProgressBound(
                              goal.inner.progress
                            )}%`,
                          },
                        ])}
                        key={`goal-gradient1-${goal.inner.id}`}
                      />
                      <View
                        style={StyleSheet.flatten([
                          styles.gradient2,
                          {
                            width: `${this.getUpperProgressBound(
                              goal.inner.progress
                            )}%`,
                          },
                        ])}
                        key={`goal-gradient2-${goal.inner.id}`}
                      />
                    </View>
                  </View>
                  <View style={styles.children}>
                    {goal.children
                      .filter((child) => this.isGoalShown(child))
                      .map((child) => (
                        <View
                          key={`goal-badge-container-${child.id}`}
                          style={styles.subgoalContainer}
                        >
                          <TouchableHighlight
                            style={styles.subgoalBadge}
                            key={`goal-badge-${child.id}`}
                            onPress={() => this.activateModal(child)}
                          >
                            <MText style={styles.subgoalText}>
                              {child.name}
                            </MText>
                          </TouchableHighlight>
                          <View style={styles.gradientContainer}>
                            <View
                              style={StyleSheet.flatten([
                                styles.gradient1,
                                {
                                  width: `${this.getLowerProgressBound(
                                    child.progress
                                  )}%`,
                                },
                              ])}
                              key={`goal-gradient1-${child.id}`}
                            />
                            <View
                              style={StyleSheet.flatten([
                                styles.gradient2,
                                {
                                  width: `${this.getUpperProgressBound(
                                    child.progress
                                  )}%`,
                                },
                              ])}
                              key={`goal-gradient2-${child.id}`}
                            />
                          </View>
                        </View>
                      ))}
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </Auth>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const loading = state.user.loading
  const error = state.user.error

  const parentGoalMap: { [key: string]: GoalContainer } = {}
  state.goal.goals.forEach((goal) => {
    if (!goal.parent) parentGoalMap[goal.id] = { inner: goal, children: [] }
    else parentGoalMap[(goal.parent as Goal).id].children.push(goal)
  })

  return {
    loading,
    error,
    goals: Object.values(parentGoalMap),
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
)(withNavigation(Goals))

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButtonStyle: {
    height: 20,
    width: 120,
    padding: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  headerButtonTextStyle: {
    fontSize: 10,
  },
  goalTitle: {
    marginLeft: 2,
    marginBottom: 4,
  },
  children: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  goalBadge: {
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    padding: 4,
  },
  subgoalBadge: {
    backgroundColor: colors.secondaryColor,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    padding: 4,
  },
  goalText: {
    color: "#fff",
    fontSize: 11,
  },
  subgoalText: {
    color: "#fff",
    fontSize: 11,
  },
  gradientContainer: {
    flex: 1,
    flexDirection: "row",
  },
  gradient1: {
    height: 4,
    borderBottomLeftRadius: borderRadius,
    marginTop: -2,
    backgroundColor: "green",
  },
  gradient2: {
    height: 4,
    borderBottomRightRadius: borderRadius,
    marginTop: -2,
    backgroundColor: "silver",
  },
  subgoalContainer: {
    margin: 2,
    maxWidth: 100,
  },
  slider: {
    width: 80,
  },
})
