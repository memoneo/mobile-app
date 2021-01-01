import { lazyProtect } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import { take, call, put, takeEvery } from "redux-saga/effects"
import { readDir, ReadDirItem, readFile, mkdir, exists } from "react-native-fs"
import { API_URL } from "../../../config"
import axios, { AxiosResponse, AxiosError } from "axios"
import {
  defaultHeaders,
  authorizedHeader,
  getErrorMessage,
} from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"
import { FileSystem } from "react-native-unimodules"
import { getRecordingDirectory } from "../../lib/dir"
import {
  TopicLogDateType,
  TopicLogValue,
  Topic,
  TopicLog,
} from "memoneo-common/lib/types"
import { dayjs } from "../../lib/reexports"
import { convertM4aToOgg } from "../../lib/bridge"

export interface RecordingState {
  loading: boolean
  error: string
  topicRecordMap: TopicRecordMap
  idOfLastSavedTopic: string
}

export type TopicRecordMap = { [topicId: string]: TopicRecord }

export interface TopicRecord {
  uri: string
  topicId: string
}

export const actionNames = {
  SAVE_RECORDING_RESPONSE: "SAVE_RECORDING_RESPONSE",
  SAVE_RECORDING_REQUEST: "SAVE_RECORDING_REQUEST",
  GET_RECORDINGS_RESPONSE: "GET_RECORDINGS_RESPONSE",
  GET_RECORDINGS_REQUEST: "GET_RECORDINGS_REQUEST",
}

export const actions = {
  saveRecordingResponse: createAction<Partial<RecordingState>>(
    actionNames.SAVE_RECORDING_RESPONSE
  ),
  saveRecordingRequest: createAction<Partial<RecordingState>>(
    actionNames.SAVE_RECORDING_REQUEST
  ),
  getRecordingsResponse: createAction<Partial<RecordingState>>(
    actionNames.GET_RECORDINGS_RESPONSE
  ),
  getRecordingsRequest: createAction<Partial<RecordingState>>(
    actionNames.GET_RECORDINGS_REQUEST
  ),
}
export const RecordingActions = actions

export default actions

const initialState: RecordingState = {
  loading: false,
  error: "",
  topicRecordMap: {},
  idOfLastSavedTopic: "",
}

export const recordingReducer = handleActions<
  RecordingState,
  Partial<RecordingState>
>(
  {
    [actionNames.GET_RECORDINGS_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.GET_RECORDINGS_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.SAVE_RECORDING_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.SAVE_RECORDING_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
  },
  initialState
)

export function* handleGetRecordings() {
  while (true) {
    const action = yield take(actions.getRecordingsRequest)
    const { date, dateType } = action.payload
    if (!date) throw Error(`date may not be null/empty in handleSaveRecording`)
    if (!dateType)
      throw Error(`dateType may not be null/empty in handleSaveRecording`)

    const recordingDirectory = getRecordingDirectory(
      dateType,
      dayjs(date).format("D-MMMM-YYYY")
    )

    const [fileExists, existsErr] = yield call(
      lazyProtect(exists(recordingDirectory))
    )
    if (existsErr) {
      console.log(existsErr.message)
      yield put(
        actions.getRecordingsResponse({
          error: "Unable to check if file path exists in document directory",
        })
      )
      continue
    }

    if (!fileExists) {
      yield put(
        actions.getRecordingsResponse({
          error: "",
          topicRecordMap: {},
        })
      )
      continue
    }

    const [dir, dirError] = yield call(lazyProtect(readDir(recordingDirectory)))

    if (dirError) {
      console.log(dirError.message)
      yield put(
        actions.getRecordingsResponse({
          error: "Unable to read files in document directory",
        })
      )
      continue
    }

    const recordingUris: string[] = dir.map(readDirItem => readDirItem.path)
    const topicRecords: TopicRecord[] = recordingUris.map(uri => {
      return {
        uri,
        topicId: uri.substring(uri.lastIndexOf("/") + 1).split(".")[0],
      }
    })

    console.log(`Found ${topicRecords.length} topicRecords`)

    const topicRecordMap: TopicRecordMap = {}

    topicRecords.forEach(
      topicRecord => (topicRecordMap[topicRecord.topicId] = topicRecord)
    )

    yield put(
      actions.getRecordingsResponse({
        error: "",
        topicRecordMap,
      })
    )
  }
}

export function* watchHandleSaveRecording() {
  yield takeEvery(actions.saveRecordingRequest, handleSaveRecording)
}

/**
 * Recognize is also able to save other related values, such as a rating in TopicLogValueTextFiveRated. Therefore
 * we already require the value property in the action payload.
 *
 * @param action
 */
function* handleSaveRecording(action: any) {
  const topic: Topic = action.payload.topic
  const date: Date = action.payload.date
  const dateType: TopicLogDateType = action.payload.dateType
  const audioFileUri: string = action.payload.audioFileUri
  const topicLog: TopicLog = action.payload.topicLog
  const value: TopicLogValue = action.payload.value

  if (!topic) throw Error(`topic may not be null/empty in handleSaveRecording`)
  if (!date) throw Error(`date may not be null/empty in handleSaveRecording`)
  if (!dateType)
    throw Error(`dateType may not be null/empty in handleSaveRecording`)
  if (!audioFileUri)
    throw Error(`audioFileUri may not be null/empty in handleSaveRecording`)
  if (!topicLog)
    throw Error("topicLog may not be null/empty in handleSaveRecording")
  if (!value) throw Error("value may not be null/empty in handleSaveRecording")

  // const audioFileConvertResult: Result<string, Error> = yield call(
  //   lazyProtect(convertM4aToOgg(audioFileUri))
  // )

  // if (audioFileConvertResult.err) {
  //   console.log(audioFileConvertResult.err.message)
  //   yield put(
  //     actions.saveRecordingResponse({
  //       error: "Unable to convert audio file to wav for speech API consumption",
  //     })
  //   )
  //   return
  // }

  const recordingDirectoryPath = getRecordingDirectory(
    dateType,
    dayjs(date).format("D-MMMM-YYYY")
  )

  const [__, mkdirError] = yield call(
    lazyProtect(mkdir(recordingDirectoryPath, {}))
  )
  if (mkdirError) {
    console.log(mkdirError.message)
    yield put(
      actions.saveRecordingResponse({
        error: "Unable to create directory",
      })
    )
    return
  }

  const newAudioFilePath = `${getRecordingDirectory(
    dateType,
    dayjs(date).format("D-MMMM-YYYY")
  )}/${topic.id}.m4a`

  console.log("Saving file to " + newAudioFilePath)

  const [_, moveError] = yield call(
    lazyProtect(
      FileSystem.moveAsync({
        from: audioFileUri,
        to: newAudioFilePath,
      })
    )
  )

  if (moveError) {
    console.log(moveError.message)
    yield put(
      actions.saveRecordingResponse({
        error: "Unable to copy converted audio file to document directory",
      })
    )
    return
  }

  // console.log(`Sending audio file from ${newAudioFilePath} to speech API`)
  // const readFileResult: Result<string, Error> = yield call(
  //   lazyProtect(readFile(audioFileUri.replace(".m4a", ".ogg"), "base64"))
  // )
  // if (readFileResult.err) {
  //   yield put(
  //     actions.saveRecordingResponse({
  //       error: `Unable to read audio file ${newAudioFilePath}`,
  //     })
  //   )
  //   return
  // }

  // const hash: string = yield call(getHash)
  //
  // const recognizeResult: Result<AxiosResponse, AxiosError> = yield call(
  //   lazyProtect(
  //     axios.post(
  //       `${API_URL}/recognize`,
  //       {
  //         audioContent: readFileResult.ok,
  //         topicId: topic.id,
  //         type: topic.typeInfo.type,
  //         topicLogId: topicLog.id,
  //         value,
  //       },
  //       {
  //         withCredentials: true,
  //         headers: { ...defaultHeaders, ...authorizedHeader(hash) },
  //       }
  //     )
  //   )
  // )

  // if (recognizeResult.err) {
  //   yield put(
  //     actions.saveRecordingResponse({
  //       error: getErrorMessage(recognizeResult.err),
  //     })
  //   )
  //   return
  // }

  // const res = recognizeResult.ok!

  // const text: string = res.data.data.text

  yield put(
    actions.saveRecordingResponse({
      error: "",
      idOfLastSavedTopic: topic.id,
    })
  )
}
