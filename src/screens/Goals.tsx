import * as React from "react"
import { View, StyleSheet } from "react-native"
import Auth from "../components/Auth"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { User, Goal } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import LinearGradient from "react-native-linear-gradient"
import { RootState } from "../redux"
import MText from "../components/common/MText"
import { GoalActions } from "../redux/goal"
import { colors, borderRadius } from "../lib/colors"
import { ScrollView } from "react-native-gesture-handler"

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

interface State {}

class Goals extends React.PureComponent<Props, State> {
  componentDidMount() {
    this.props.goalActions.getGoalsRequest()
  }

  getLowerProgressBound = (progress: number): number => Math.max(5, progress)
  getUpperProgressBound = (progress: number): number =>
    Math.min(95, 100 - progress)

  render(): JSX.Element {
    const { goals } = this.props

    return (
      <Auth>
        <View style={styles.main}>
          <View style={styles.header}>
            <MText h2 bold>
              Goals
            </MText>
          </View>
          <ScrollView style={{}}>
            {goals.map((goal) => (
              <View key={`goal-${goal.inner.id}-view`} style={{}}>
                <View style={styles.goalTitle}>
                  <MText bold>{goal.inner.name}</MText>
                </View>
                <View style={styles.children}>
                  {goal.children.map((child) => (
                    <View
                      key={`goal-badge-container-${child.id}`}
                      style={styles.subgoalContainer}
                    >
                      <View
                        style={styles.subgoalBadge}
                        key={`goal-badge-${child.id}`}
                      >
                        <MText style={styles.subgoalText}>{child.name}</MText>
                      </View>
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
  header: {},
  goalTitle: {
    marginBottom: 4,
  },
  children: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  subgoalBadge: {
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    padding: 4,
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
})
