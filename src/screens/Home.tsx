import * as React from "react"
import { View, StyleSheet } from "react-native"
import Auth from "../components/Auth"
import { Icon } from "react-native-elements"
import { focusedColor } from "../lib/colors"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { UserActions } from "../redux/user"
import { User, TopicLogWithDatesAsDayJs, Goal } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../redux"
import MText from "../components/common/MText"
import Header from "../components/Header"
import { TopicActions } from "../redux/topic"
import { formatDateType } from "../lib/format"
import MBadge from "../components/common/MBadge"
import NotificationHandler from "../components/NotificationHandler"
import { GoalActions } from "../redux/goal"

interface OwnProps {}

interface StateProps {
  ownUser?: User
  loading: boolean
  error: string
  topicLogs: TopicLogWithDatesAsDayJs[]
  goals: Goal[]
}

interface DispatchProps {
  userActions: typeof UserActions
  topicActions: typeof TopicActions
  goalActions: typeof GoalActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

class Home extends React.PureComponent<Props, State> {
  componentDidMount() {
    this.props.userActions.getUserRequest()
    this.props.topicActions.getTopicLogsRequest()
    this.props.goalActions.getGoalsRequest()
  }

  render(): JSX.Element {
    const { ownUser, topicLogs, goals, navigation } = this.props

    const adjustedTopicLogs =
      topicLogs.length > 10 ? topicLogs.slice(0, 10) : topicLogs

    return (
      <Auth>
        <View style={styles.main}>
          <NotificationHandler />
          <Header />
          <View style={styles.userInfoContainer}>
            {ownUser && (
              <MText style={styles.userInfoText}>Hello {ownUser.name}.</MText>
            )}
          </View>
          <View style={styles.goalContainer}>
            <View style={styles.goalContainerHeader}>
              <MText h2 bold style={styles.lastEntriesTitle}>
                Goals
              </MText>
              <Icon
                name="magnifying-glass"
                type="foundation"
                reverse
                size={12}
                onPress={() => navigation.navigate("Goals")}
              />
            </View>
            <View style={styles.goalInnerContainer}>
              {goals.map(goal => (
                <View key={`goal-${goal.id}-view`} style={styles.goal}>
                  <MBadge key={`goal-${goal.id}`} value={goal.name} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.topicContainer}>
            <MText h2 bold style={styles.lastEntriesTitle}>
              Last entries
            </MText>
            {adjustedTopicLogs.length === 0 && <MText>No entries found.</MText>}
            {adjustedTopicLogs.length > 0 && (
              <View>
                {adjustedTopicLogs.map(topicLog => (
                  <View
                    key={`topicLog-${topicLog.id}`}
                    style={styles.topicLogEntry}>
                    <MText
                      onPress={() =>
                        this.props.navigation.navigate("AddEntry", {
                          date: topicLog.date,
                        })
                      }>
                      {topicLog.date.format("D MMMM YYYY")}
                    </MText>
                    <MBadge value={`${formatDateType(topicLog.dateType)}`} />
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.actionContainer}>
            <Icon
              name="plus"
              type="feather"
              color={focusedColor}
              reverse
              onPress={() => this.props.navigation.navigate("AddEntry")}
            />
          </View>
        </View>
      </Auth>
    )
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const loading = state.user.loading
  const error = state.user.error
  const ownUser = state.user.ownUser
  const goals = state.goal.goals.filter(goal => !goal.parent)
  const topicLogs = state.topic.topicLogs

  return {
    ownUser,
    loading,
    error,
    goals,
    topicLogs,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    topicActions: bindActionCreators(TopicActions, dispatch),
    goalActions: bindActionCreators(GoalActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Home))

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  goalContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  goalContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalInnerContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  goal: {
    marginBottom: 2,
  },
  topicContainer: {
    flex: 0,
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
  userInfoLogo: {},
  actionContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  topicLogEntry: {
    width: 140,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastEntriesTitle: {
    marginBottom: 8,
  },
})
