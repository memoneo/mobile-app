import * as React from "react"
import { View, StyleSheet } from "react-native"
import Auth from "../components/Auth"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { User, Goal } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../redux"
import MText from "../components/common/MText"
import MBadge from "../components/common/MBadge"
import { GoalActions } from "../redux/goal"

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
          <View style={{}}>
            {goals.map((goal) => (
              <View key={`goal-${goal.inner.id}-view`} style={{}}>
                <View>
                  <MText bold>{goal.inner.name}</MText>
                </View>
                <View style={styles.children}>
                  {goal.children.map((child) => (
                    <MBadge key={`goal-${child.id}`} value={child.name} />
                  ))}
                </View>
              </View>
            ))}
          </View>
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
  children: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
})
