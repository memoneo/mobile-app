import * as React from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  EmitterSubscription,
  KeyboardAvoidingView,
  YellowBox,
} from "react-native"
import {
  Topic,
  TopicLogDateType,
  TopicLog,
  Person,
  Goal,
} from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { Audio } from "expo-av"
import Auth from "../../components/Auth"
import {
  NavigationInjectedProps,
  withNavigation,
  ScrollView,
} from "react-navigation"
import DateTimePicker from "@react-native-community/datetimepicker"
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view"

import { UserActions } from "../../redux/user"
import { RootState } from "../../redux"
import { dayjs } from "../../lib/reexports"
import MText from "../../components/common/MText"
import MPicker from "../../components/common/MPicker"
import MButton from "../../components/common/MButton"
import { RecordingActions, TopicRecordMap } from "../../redux/recording"
import recordingOptions from "../../lib/recordingOptions"
import MError from "../../components/common/MError"
import { getRecordingDirectory } from "../../lib/dir"
import { AddEntryDate } from "../../types/AddEntry"
import AddEntryTopicContainer from "./AddEntryTopicContainer"
import { TopicActions, TopicLogValueMap } from "../../redux/topic"
import { PersonActions } from "../../redux/person"
import { Dayjs } from "dayjs"
import { GoalActions } from "../../redux/goal"
import { Picker } from "@react-native-community/picker"
import AddEntryInner from "./AddEntryInner"

import { RecordContext } from "./RecordBar"

YellowBox.ignoreWarnings(["Deprecation in 'navigationOptions'"])

interface OwnProps {}

interface StateProps {
  persons: Person[]
  topics: Topic[]
  goals: Goal[]
  loading: boolean
  loadingTopic: boolean
  loadingRecording: boolean
  loadingUser: boolean
  /**
   * This is necessary to make sure that AddEntry.canRecord() returns true when loading
   * due to saving a value. The rational for this is that otherwise you see the record button
   * blinking from disabled <-> not disabled a lot.
   */
  loadingSaveValue: boolean
  recordingError: string
  topicError: string
  topicLog?: TopicLog
  topicRecordMap: TopicRecordMap
  idOfLastSavedTopic: string
  topicLogValueMap: TopicLogValueMap
}

interface DispatchProps {
  userActions: typeof UserActions
  recordingActions: typeof RecordingActions
  topicActions: typeof TopicActions
  personActions: typeof PersonActions
  goalActions: typeof GoalActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  hasPermissions: boolean
  permissionsLoaded: boolean
  dateType: TopicLogDateType
  date: Dayjs
  showDatePicker: boolean
  showOptions: boolean
  recording: string
  playing: string
  keyboardShown: boolean
  keyboardHeight: number
}

class AddEntry extends React.PureComponent<Props, State> {
  static navigationOptions = ({ navigation }) => {
    let header = undefined
    if (
      navigation.state.params &&
      navigation.state.params.headerShown === false
    ) {
      header = null
    }

    return {
      header,
    }
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      permissionsLoaded: false,
      hasPermissions: true,
      // I shouldn't need to cast here!
      dateType: "daily" as TopicLogDateType,
      date: this.props.navigation.getParam("date") || dayjs(),
      showDatePicker: false,
      recording: "",
      playing: "",
      showOptions: true,
      keyboardShown: false,
      keyboardHeight: 0,
    }
  }

  sound?: Audio.Sound = null
  recordingData?: Audio.Recording = null

  keyboardDidShowListener?: EmitterSubscription = null
  keyboardDidHideListener?: EmitterSubscription = null

  async componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      event => {
        this.props.navigation.setParams({ headerShown: false })

        this.setState({
          keyboardShown: true,
          keyboardHeight: event.endCoordinates.height,
        })
      }
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardShown: false })
        this.props.navigation.setParams({ headerShown: true })
      }
    )

    this.props.topicActions.getTopicsRequest()
    this.props.personActions.getPersonsRequest()
    this.props.goalActions.getGoalsRequest()

    const audioPermissions = await Audio.getPermissionsAsync()
    if (!audioPermissions.granted) {
      const response = await Audio.requestPermissionsAsync()

      if (response.granted) {
        return
      }
      this.setState({ hasPermissions: false })
    }

    // outdated
    // const dateParam: Dayjs | undefined = this.props.navigation.getParam("date")
    // if (dateParam) {
    //   this.setDate({}, dateParam.toDate())
    //   return
    // }

    this.updateRecordings()

    this.props.topicActions.getOrCreateTopicLogRequest({
      date: this.getCurrentDate(),
      dateType: this.state.dateType,
    })

    if (this.props.topicLog) {
      this.props.topicActions.getTopicLogValuesRequest({
        topicLog: this.props.topicLog,
      })
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps) {
      if (prevProps.idOfLastSavedTopic !== this.props.idOfLastSavedTopic) {
        this.updateRecordings()
      }

      if (
        (!prevProps.topicLog && this.props.topicLog) ||
        (prevProps.topicLog && prevProps.topicLog.id !== this.props.topicLog.id)
      ) {
        this.props.topicActions.getTopicLogValuesRequest({
          topicLog: this.props.topicLog,
        })
      }

      const oldDateParam: Dayjs | undefined = prevProps.navigation.getParam(
        "date"
      )
      const dateParam: Dayjs | undefined = this.props.navigation.getParam(
        "date"
      )
      if (oldDateParam.diff(dateParam, "date") !== 0) {
        this.setDate({}, dateParam.toDate())
        return
      }
    }
  }

  updateRecordings() {
    this.props.recordingActions.getRecordingsRequest({
      date: this.getCurrentDate(),
      dateType: this.state.dateType,
    })
  }

  componentWillUnmount() {
    this.stopRecording()
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove()
    }

    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove()
    }
  }

  setDate = (_, date: Date) => {
    const dayJsDate = dayjs(date) || this.state.date

    if (dayJsDate === this.state.date) {
      console.log("date is same, no state update is needed")
      return
    }

    console.log(`setting date to ${date}`)

    this.setState(
      {
        showDatePicker: false,
        date: dayJsDate,
      },
      () => {
        this.props.topicActions.getOrCreateTopicLogRequest({
          date,
          dateType: this.state.dateType,
        })

        this.updateRecordings()
      }
    )
  }

  /**
   * Can be deleted later.
   */
  getCurrentDate = (): Dayjs => this.state.date

  canRecord = (): boolean =>
    !this.props.loadingRecording &&
    !this.props.loadingUser &&
    (!this.props.loadingTopic || this.props.loadingSaveValue) &&
    this.props.topicLog !== undefined

  startRecording = async (topic: Topic, overwrite: boolean = false) => {
    if (!this.canRecord()) return

    const { topicRecordMap } = this.props

    const hasExistingRecording = topicRecordMap[topic.id] !== undefined

    if (!overwrite && hasExistingRecording) {
      Alert.alert(
        "Existing record found",
        "Do you want to overwrite your existing entry?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled recording"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => this.startRecording(topic, true),
          },
        ],
        { cancelable: false }
      )
      return
    }

    this.recordingData = new Audio.Recording()

    await this.recordingData.prepareToRecordAsync(recordingOptions)
    await this.recordingData.startAsync()

    this.setState({ recording: topic.id })
  }

  /**
   * For date this function will also accept other types in the future, when other dateTypes are implemented too.
   *
   * Assumes that a sound exists.
   */
  playRecording = async (
    topic: Topic,
    date: Dayjs,
    dateType: TopicLogDateType
  ) => {
    this.sound = new Audio.Sound()

    const path = getRecordingDirectory(
      dateType,
      date.format("D-MMMM-YYYY")
    )
    await this.sound.loadAsync({ uri: path + `/${topic.id}.m4a` })
    this.sound.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded) {
        if (status.didJustFinish) {
          this.stopPlayRecording()
        }
      }
    })
    await this.sound.playAsync()

    this.setState({ playing: topic.id })
  }

  stopPlayRecording = async (data?: {
    topic: Topic
    date: AddEntryDate
    dateType: TopicLogDateType
  }) => {
    if (this.sound) {
      await this.sound.stopAsync()

      this.sound = null
    }

    this.setState({ playing: "" })
  }

  stopRecording = async (data?: { topic: Topic }) => {
    if (this.state.recording) {
      await this.recordingData.stopAndUnloadAsync()

      if (data) {
        const { topic } = data
        const { topicLog, recordingActions } = this.props

        const date = this.getCurrentDate()
        const dateType = this.state.dateType
        const audioFileUri = this.recordingData.getURI()

        recordingActions.saveRecordingRequest({
          topic,
          topicLog,
          date,
          dateType,
          audioFileUri,
          // TODO currently this is fine as only simpletext topic type is implemented.
          value: {
            text: "",
          },
        })
      }

      this.recordingData = null

      this.setState({ recording: "" })
    }
  }

  handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const OFFSET = 60

    if (this.state.showOptions) {
      if (
        event.nativeEvent.contentOffset.y >
        OFFSET + styles.optionsContainer.height
      ) {
        this.setState({ showOptions: false })
      }
    } else {
      if (event.nativeEvent.contentOffset.y <= OFFSET) {
        this.setState({ showOptions: true })
      }
    }
  }

  render(): JSX.Element {
    const {
      topics,
      goals,
      recordingError,
      topicError,
      topicRecordMap,
      topicLog,
      topicActions,
      topicLogValueMap,
      persons,
    } = this.props
    const {
      hasPermissions,
      dateType,
      date,
      showDatePicker,
      recording,
      playing,
      showOptions,
      keyboardShown,
      keyboardHeight,
    } = this.state

    const hasTopicLog = topicLog !== undefined

    return (
      <Auth>
        <SafeAreaView style={styles.main}>
          <RecordContext.Provider
            value={{
              recording,
              playing,
              topicRecordMap,
              canRecord: this.canRecord,
              startRecording: this.startRecording,
              playRecording: this.playRecording,
              stopRecording: this.stopRecording,
              stopPlayRecording: this.stopPlayRecording,
            }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              {showOptions && !keyboardShown && (
                <View style={styles.optionsContainer}>
                  <View style={{ flex: 1 }}>
                    <MPicker
                      selectedValue={dateType}
                      enabled={false}
                      onValueChange={value =>
                        this.setState({ dateType: value as TopicLogDateType })
                      }>
                      <Picker.Item label="Daily" value="daily" />
                      <Picker.Item label="Weekly" value="weekly" />
                      <Picker.Item label="Monthly" value="monthly" />
                      <Picker.Item label="Yearly" value="yearly" />
                    </MPicker>
                  </View>
                  {dateType === "daily" && (
                    <>
                      <View>
                        <MButton
                          buttonStyle={styles.optionsButton}
                          titleStyle={styles.optionsButtonTitle}
                          onPress={() =>
                            this.setState({ showDatePicker: true })
                          }
                          title="Select day"
                        />
                        {showDatePicker && (
                          <DateTimePicker
                            value={date.toDate()}
                            mode="date"
                            display="default"
                            onChange={this.setDate}
                          />
                        )}
                      </View>
                    </>
                  )}
                </View>
              )}
              {!keyboardShown && dateType === "daily" && (
                <View>
                  <MText h3 bold>
                    {dayjs(date).format("D MMMM YYYY")}
                  </MText>
                </View>
              )}
              {!hasPermissions && (
                <View style={styles.noPermissionsContainer}>
                  <MText>Please enable audio for Memoneo to proceed.</MText>
                </View>
              )}
              {recordingError.length > 0 && (
                <View style={styles.noPermissionsContainer}>
                  <MError text={recordingError} />
                </View>
              )}
              {topicError.length > 0 && (
                <View style={styles.noPermissionsContainer}>
                  <MError text={topicError} />
                </View>
              )}
              {hasPermissions && hasTopicLog && (
                <KeyboardAwareFlatList
                  data={topics}
                  onScroll={this.handleScroll}
                  removeClippedSubviews={false}
                  style={StyleSheet.flatten([
                    styles.entryList,
                    {
                      paddingBottom: keyboardShown ? keyboardHeight : 100,
                    },
                  ])}
                  renderItem={({ item, index }) => (
                    <React.Fragment>
                      <AddEntryInner
                        topic={item}
                        topicActions={topicActions}
                        goals={goals}
                        persons={persons}
                        topicRecordMap={topicRecordMap}
                        topicLogValueMap={topicLogValueMap}
                        date={date}
                        dateType={dateType}
                        topicLog={topicLog}
                      />
                    </React.Fragment>
                  )}
                />
              )}
            </KeyboardAvoidingView>
          </RecordContext.Provider>
        </SafeAreaView>
      </Auth>
    )
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const loading =
    state.user.loading || state.recording.loading || state.topic.loading
  const loadingRecording = state.recording.loading
  const loadingUser = state.user.loading
  const loadingTopic = state.topic.loading
  const loadingSaveValue = state.topic.loadingSaveValue

  const topics = state.topic.topics.filter(topic => !topic.deleted)
  const topicError = state.topic.error

  const goals = state.goal.goals

  const recordingError = state.recording.error
  const topicRecordMap = state.recording.topicRecordMap
  const idOfLastSavedTopic = state.recording.idOfLastSavedTopic

  const topicLog = state.topic.activeTopicLog
  const topicLogValueMap = state.topic.topicLogValueMap

  const persons = state.person.persons

  return {
    topics,
    goals,
    loading,
    loadingRecording,
    loadingUser,
    loadingTopic,
    loadingSaveValue,
    topicError,
    recordingError,
    topicRecordMap,
    idOfLastSavedTopic,
    topicLog,
    topicLogValueMap,
    persons,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    recordingActions: bindActionCreators(RecordingActions, dispatch),
    topicActions: bindActionCreators(TopicActions, dispatch),
    personActions: bindActionCreators(PersonActions, dispatch),
    goalActions: bindActionCreators(GoalActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(AddEntry))

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
  scrollContainer: {},
  userInfoLogo: {},
  noPermissionsContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  optionsButton: {
    height: 20,
  },
  optionsButtonTitle: {
    fontSize: 11,
  },
  entryList: {
    flex: 1,
  },
})
