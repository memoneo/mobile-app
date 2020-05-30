import * as React from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  Picker,
  Button,
  Alert,
} from "react-native"
import {
  Topic,
  TopicLogDateType,
  TopicLog,
  Person,
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

interface OwnProps {}

interface StateProps {
  persons: Person[]
  topics: Topic[]
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
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  hasPermissions: boolean
  permissionsLoaded: boolean
  dateType: TopicLogDateType
  date: AddEntryDate
  showDatePicker: boolean
  recording: string
  playing: string
}

class AddEntry extends React.PureComponent<Props, State> {
  state = {
    permissionsLoaded: false,
    hasPermissions: true,
    // I shouldn't need to cast here!
    dateType: "daily" as TopicLogDateType,
    date: new Date(),
    showDatePicker: false,
    recording: "",
    playing: "",
  }

  sound?: Audio.Sound = null
  recordingData?: Audio.Recording = null

  async componentDidMount() {
    this.props.topicActions.getTopicsRequest()
    this.props.personActions.getPersonsRequest()

    const audioPermissions = await Audio.getPermissionsAsync()
    if (!audioPermissions.granted) {
      const response = await Audio.requestPermissionsAsync()

      if (response.granted) {
        return
      }
      this.setState({ hasPermissions: false })
    }

    this.updateRecordings()

    const dateParam: Dayjs | undefined = this.props.navigation.getParam("date")
    if (dateParam) {
      this.setDate({}, dateParam.toDate())
      return
    }

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
  }

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
    date: AddEntryDate,
    dateType: TopicLogDateType
  ) => {
    this.sound = new Audio.Sound()

    const path = getRecordingDirectory(
      dateType,
      dayjs(date).format("D-MMMM-YYYY")
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

  render(): JSX.Element {
    const {
      topics,
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
    } = this.state

    const hasTopicLog = topicLog !== undefined

    return (
      <Auth>
        <SafeAreaView style={styles.main}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.optionsContainer}>
              <View style={{ flex: 1 }}>
                <MPicker
                  selectedValue={dateType}
                  enabled={false}
                  onValueChange={value => this.setState({ dateType: value })}>
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
                      onPress={() => this.setState({ showDatePicker: true })}
                      title="Select day"
                    />
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={this.setDate}
                      />
                    )}
                  </View>
                </>
              )}
            </View>
            {dateType === "daily" && (
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
              <View>
                {topics.map(topic => {
                  const isRecordingTopic =
                    recording.length > 0 && recording === topic.id
                  const isRecordingDifferentTopic =
                    recording.length > 0 && recording !== topic.id
                  const isPlayingTopic =
                    playing.length > 0 && playing === topic.id
                  const isPlayingDifferentTopic =
                    playing.length > 0 && playing !== topic.id
                  const hasRecording = topicRecordMap.hasOwnProperty(topic.id)

                  const outerValue = topicLogValueMap[topic.id]
                  const innerValue = outerValue ? outerValue.value : undefined

                  return (
                    <AddEntryTopicContainer
                      key={`add-entry-topic-${topic.id}`}
                      topic={topic}
                      topicLog={topicLog}
                      topicActions={topicActions}
                      persons={persons}
                      date={date}
                      dateType={dateType}
                      value={innerValue}
                      canRecord={this.canRecord()}
                      isRecordingTopic={isRecordingTopic}
                      isRecordingDifferentTopic={isRecordingDifferentTopic}
                      isPlaying={isPlayingTopic}
                      isPlayingDifferentTopic={isPlayingDifferentTopic}
                      hasRecording={hasRecording}
                      startRecording={() => this.startRecording(topic)}
                      playRecording={() =>
                        this.playRecording(topic, date, dateType)
                      }
                      stopPlayRecording={() => this.stopPlayRecording()}
                      stopRecording={() => this.stopRecording({ topic })}
                    />
                  )
                })}
              </View>
            )}
          </ScrollView>
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

  const recordingError = state.recording.error
  const topicRecordMap = state.recording.topicRecordMap
  const idOfLastSavedTopic = state.recording.idOfLastSavedTopic

  const topicLog = state.topic.activeTopicLog
  const topicLogValueMap = state.topic.topicLogValueMap

  const persons = state.person.persons

  return {
    topics,
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
  },
  optionsButton: {
    height: 20,
  },
  optionsButtonTitle: {
    fontSize: 11,
  },
})
