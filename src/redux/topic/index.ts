import { lazyProtect } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import { take, call, put, delay, takeEvery } from "redux-saga/effects"
import {
  Topic,
  TopicLog,
  TopicLogDateType,
  TopicLogValue,
  TopicLogValueContainer,
  TopicLogWithDatesAsString,
  TopicLogWithDatesAsDayJs,
  TopicLogValueTextSimple,
  TopicLogValueTextFiveRated,
} from "memoneo-common/lib/types/Topic"
import { API_URL } from "../../../config"
import axios, { AxiosResponse, AxiosError } from "axios"
import {
  defaultHeaders,
  authorizedHeader,
  getErrorMessage,
} from "memoneo-common/lib/utils/axios"
import { getHash, getTextEncryptionKey } from "../../lib/redux"
import { AddEntryDate } from "../../types/AddEntry"
import { formatAddEntryDate } from "../../lib/format"
import { dayjs } from "../../lib/reexports"
import { decryptTopicLogValues } from "./lib"
import { isTextTopic } from "../../lib/topic"
import { encryptText } from "../../lib/encryption"
import { textStandardColor } from "../../lib/colors"

export interface TopicState {
  loading: boolean
  loadingSaveValue: boolean
  loadingUpdate: boolean
  errorUpdate: string
  loadingCreate: boolean
  errorCreate: string
  loadingDelete: boolean
  errorDelete: string
  topics: Topic[]
  error: string
  topicLogs: TopicLogWithDatesAsDayJs[]
  activeTopicLog?: TopicLog
  topicLogValueMap: TopicLogValueMap
}

export type TopicLogValueMap = {
  [topicId: string]: TopicLogValueContainer<TopicLogValue>
}

const actionNames = {
  CHANGE_PRIORITY_TOPIC_REQUEST: "CHANGE_PRIORITY_TOPIC_REQUEST",
  CHANGE_PRIORITY_TOPIC_RESPONSE: "CHANGE_PRIORITY_TOPIC_RESPONSE",
  GET_TOPICS_REQUEST: "GET_TOPICS_REQUEST",
  GET_TOPICS_RESPONSE: "GET_TOPICS_RESPONSE",
  UPDATE_TOPIC_REQUEST: "UPDATE_TOPIC_REQUEST",
  UPDATE_TOPIC_RESPONSE: "UPDATE_TOPIC_RESPONSE",
  DELETE_TOPIC_REQUEST: "DELETE_TOPIC_REQUEST",
  DELETE_TOPIC_RESPONSE: "DELETE_TOPIC_RESPONSE",
  CREATE_TOPIC_REQUEST: "CREATE_TOPIC_REQUEST",
  CREATE_TOPIC_RESPONSE: "CREATE_TOPIC_RESPONSE",
  GET_TOPIC_LOGS_REQUEST: "GET_TOPIC_LOGS_REQUEST",
  GET_TOPIC_LOGS_RESPONSE: "GET_TOPIC_LOGS_RESPONSE",
  GET_OR_CREATE_TOPIC_LOG_REQUEST: "GET_OR_CREATE_TOPIC_LOG_REQUEST",
  GET_OR_CREATE_TOPIC_LOG_RESPONSE: "GET_OR_CREATE_TOPIC_LOG_RESPONSE",
  CREATE_OR_UPDATE_TOPIC_LOG_VALUE_REQUEST:
    "CREATE_OR_UPDATE_TOPIC_LOG_VALUE_REQUEST",
  CREATE_OR_UPDATE_TOPIC_LOG_VALUE_RESPONSE:
    "CREATE_OR_UPDATE_TOPIC_LOG_VALUE_RESPONSE",
  GET_TOPIC_LOG_VALUES_REQUEST: "GET_TOPIC_LOG_VALUES_REQUEST",
  GET_TOPIC_LOG_VALUES_RESPONSE: "GET_TOPIC_LOG_VALUES_RESPONSE",
}

const actions = {
  changePriorityTopicRequest: createAction<any>(
    actionNames.CHANGE_PRIORITY_TOPIC_REQUEST
  ),
  changePriorityTopicResponse: createAction<any>(
    actionNames.CHANGE_PRIORITY_TOPIC_RESPONSE
  ),
  getTopicsRequest: createAction<any>(actionNames.GET_TOPICS_REQUEST),
  getTopicsResponse: createAction<any>(actionNames.GET_TOPICS_RESPONSE),
  updateTopicRequest: createAction<any>(actionNames.UPDATE_TOPIC_REQUEST),
  updateTopicResponse: createAction<any>(actionNames.UPDATE_TOPIC_RESPONSE),
  deleteTopicRequest: createAction<any>(actionNames.DELETE_TOPIC_REQUEST),
  deleteTopicResponse: createAction<any>(actionNames.DELETE_TOPIC_RESPONSE),
  createTopicRequest: createAction<any>(actionNames.CREATE_TOPIC_REQUEST),
  createTopicResponse: createAction<any>(actionNames.CREATE_TOPIC_RESPONSE),
  getTopicLogsRequest: createAction<any>(actionNames.GET_TOPIC_LOGS_REQUEST),
  getTopicLogsResponse: createAction<any>(actionNames.GET_TOPIC_LOGS_RESPONSE),
  getOrCreateTopicLogRequest: createAction<any>(
    actionNames.GET_OR_CREATE_TOPIC_LOG_REQUEST
  ),
  getOrCreateTopicLogResponse: createAction<any>(
    actionNames.GET_OR_CREATE_TOPIC_LOG_RESPONSE
  ),
  createOrUpdateTopicLogValueRequest: createAction<any>(
    actionNames.CREATE_OR_UPDATE_TOPIC_LOG_VALUE_REQUEST
  ),
  createOrUpdateTopicLogValueResponse: createAction<any>(
    actionNames.CREATE_OR_UPDATE_TOPIC_LOG_VALUE_RESPONSE
  ),
  getTopicLogValuesRequest: createAction(
    actionNames.GET_TOPIC_LOG_VALUES_REQUEST
  ),
  getTopicLogValuesResponse: createAction(
    actionNames.GET_TOPIC_LOG_VALUES_RESPONSE
  ),
}

export const TopicActions = actions

const initialTopicState: TopicState = {
  loading: false,
  loadingSaveValue: false,
  loadingDelete: false,
  errorDelete: "",
  loadingUpdate: false,
  errorUpdate: "",
  loadingCreate: false,
  errorCreate: "",
  topicLogs: [],
  topics: [],
  error: "",
  topicLogValueMap: {},
}

export const topicReducer = handleActions<TopicState, any>(
  {
    [actionNames.GET_TOPICS_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.GET_TOPICS_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.GET_TOPIC_LOGS_REQUEST]: (state, action) => {
      return {
        ...state,
        error: "",
      }
    },
    [actionNames.GET_TOPIC_LOGS_RESPONSE]: (state: TopicState, action) => {
      const tmpTopicLogs: TopicLogWithDatesAsString[] =
        action.payload.topicLogs || []

      let topicLogs: TopicLogWithDatesAsDayJs[] = tmpTopicLogs
        .map(topicLog => {
          return {
            id: topicLog.id,
            dateType: topicLog.dateType,
            date: dayjs(topicLog.date, "DD-MM-YYYY"),
            createdAt: dayjs(topicLog.createdAt, "DD-MM-YYYY"),
          }
        })
        .sort(function (a, b) {
          if (a.date.isAfter(b.date)) {
            return -1
          }

          if (a.date.isBefore(b.date)) {
            return 1
          }

          return 0
        })

      return {
        ...state,
        topicLogs,
      }
    },
    [actionNames.GET_OR_CREATE_TOPIC_LOG_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.GET_OR_CREATE_TOPIC_LOG_RESPONSE]: (state, action) => {
      return {
        ...state,
        loading: false,
        activeTopicLog: action.payload.activeTopicLog,
      }
    },
    [actionNames.CREATE_OR_UPDATE_TOPIC_LOG_VALUE_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        loadingSaveValue: true,
        error: "",
      }
    },
    [actionNames.CREATE_OR_UPDATE_TOPIC_LOG_VALUE_RESPONSE]: (
      state: TopicState,
      action
    ) => {
      const newTopicLogValueMap: TopicLogValueMap = {
        ...state.topicLogValueMap,
      }

      const newValue: TopicLogValue | undefined = action.payload.newValue
      const topicLog: TopicLog | undefined = action.payload.topicLog
      const topic: Topic | undefined = action.payload.topic
      const encrypted: boolean | undefined = action.payload.encrypted

      if (newValue && topicLog && topic) {
        newTopicLogValueMap[topic.id] = {
          topicId: topic.id,
          topicLogId: topicLog.id,
          value: newValue,
          type: topic.typeInfo.type,
          encrypted,
        }
      }

      return {
        ...state,
        loading: false,
        loadingSaveValue: false,
        topicLogValueMap: newTopicLogValueMap,
      }
    },
    [actionNames.GET_TOPIC_LOG_VALUES_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.GET_TOPIC_LOG_VALUES_RESPONSE]: (state, action) => {
      const newTopicLogValueMap: TopicLogValueMap = {}

      const topicLogValues: TopicLogValueContainer<TopicLogValue>[] =
        action.payload.topicLogValues || []
      topicLogValues.forEach(
        topicLogValue =>
          (newTopicLogValueMap[topicLogValue.topicId] = topicLogValue)
      )

      return {
        ...state,
        loading: false,
        error: action.payload.error,
        topicLogValueMap: newTopicLogValueMap,
      }
    },
    [actionNames.DELETE_TOPIC_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingDelete: true,
        errorDelete: "",
      }
    },
    [actionNames.DELETE_TOPIC_RESPONSE]: (state: TopicState, action) => {
      const topic: Topic | undefined = action.payload.topic
      const error: string | undefined = action.payload.error

      if (!error) {
        topic.deleted = true
      }

      const newTopics: Topic[] = [...state.topics]

      return {
        ...state,
        loadingDelete: false,
        topics: newTopics,
      }
    },
    [actionNames.CHANGE_PRIORITY_TOPIC_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingDelete: true,
        errorDelete: "",
      }
    },
    [actionNames.CHANGE_PRIORITY_TOPIC_RESPONSE]: (
      state: TopicState,
      action
    ) => {
      const topics: Topic[] | undefined = action.payload.topics
      const error: string | undefined = action.payload.error

      const newTopics: Topic[] = topics || [...state.topics]

      return {
        ...state,
        topics: newTopics,
      }
    },
    [actionNames.CREATE_TOPIC_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingCreate: true,
        errorCreate: "",
      }
    },
    [actionNames.CREATE_TOPIC_RESPONSE]: (state: TopicState, action) => {
      const topic: Topic | undefined = action.payload.topic
      const error: string | undefined = action.payload.error

      const newTopics: Topic[] = [...state.topics]
      if (topic && !error) newTopics.push(topic)

      return {
        ...state,
        errorCreate: error,
        loadingCreate: false,
        topics: newTopics,
      }
    },
    [actionNames.UPDATE_TOPIC_REQUEST]: (state: TopicState) => {
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: "",
      }
    },
    [actionNames.UPDATE_TOPIC_RESPONSE]: (state: TopicState, action) => {
      const topic: Topic | undefined = action.payload.topic
      const error: string | undefined = action.payload.error

      const newTopics: Topic[] = [...state.topics]

      if (!error) {
        const idx = newTopics.findIndex(
          currentTopic => currentTopic.id === topic.id
        )
        if (idx !== -1) {
          newTopics[idx] = topic
        }
      }

      return {
        ...state,
        loadingUpdate: false,
        topics: newTopics,
      }
    },
  },
  initialTopicState
)

export function* watchHandleGetTopics() {
  yield takeEvery(actions.getTopicsRequest, handleGetTopics)
}

function* handleGetTopics(action: any) {
  const hash: string = yield call(getHash)

  const [topicsBody, topicsError] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/topic/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (topicsError) {
    yield put(
      actions.getTopicsResponse({
        error: getErrorMessage(topicsError),
      })
    )
    return
  }

  const topics: Topic[] = topicsBody.data.data

  yield put(
    actions.getTopicsResponse({
      error: "",
      topics,
    })
  )
}

export function* watchHandleGetTopicLogs() {
  yield takeEvery(actions.getTopicLogsRequest, handleGetTopicLogs)
}

function* handleGetTopicLogs(action: any) {
  const hash: string = yield call(getHash)

  const [topicLogsBody, topicLogsError] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/topiclog/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (topicLogsError) {
    yield put(
      actions.getTopicLogsResponse({
        error: getErrorMessage(topicLogsError),
      })
    )
    return
  }

  const topicLogs: TopicLog[] = topicLogsBody.data.data

  yield put(
    actions.getTopicLogsResponse({
      error: "",
      topicLogs,
    })
  )
}

export function* handleGetOrCreateTopicLog() {
  while (true) {
    const action = yield take(actions.getOrCreateTopicLogRequest)
    const date: AddEntryDate = action.payload.date
    const dateType: TopicLogDateType = action.payload.dateType

    const hash: string = yield call(getHash)

    const dateString = formatAddEntryDate(date)

    const [getOrCreateBody, getOrCreateError] = yield call(
      lazyProtect(
        axios.get(`${API_URL}/topiclog/getorcreate/${dateType}/${dateString}`, {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        })
      )
    )

    if (getOrCreateError) {
      yield put(
        actions.getOrCreateTopicLogResponse({
          error: getErrorMessage(getOrCreateError),
        })
      )
      continue
    }

    const topicLog: TopicLog = getOrCreateBody.data.data

    yield put(
      actions.getOrCreateTopicLogResponse({
        error: "",
        activeTopicLog: topicLog,
      })
    )
  }
}

export function* watchHandleCreateOrUpdateTopicLogValue() {
  yield takeEvery(
    actions.createOrUpdateTopicLogValueRequest,
    handleCreateOrUpdateTopicLogValue
  )
}

function* handleCreateOrUpdateTopicLogValue(action) {
  const topic: Topic = action.payload.topic
  const topicLog: TopicLog = action.payload.topicLog
  const type = topic.typeInfo.type
  const value: TopicLogValue = action.payload.value

  const body = {
    topicId: topic.id,
    topicLogId: topicLog.id,
    type,
    value: { ...value },
    encrypted: false,
  }

  const hash: string = yield call(getHash)

  // TODO to another function
  if (isTextTopic(type)) {
    const textValue = body.value as
      | TopicLogValueTextFiveRated
      | TopicLogValueTextSimple
    if (textValue.text && textValue.text.length > 0) {
      const [textEncryptionKey, textEncryptionKeyError] = yield call(
        getTextEncryptionKey
      )

      if (textEncryptionKeyError) {
        yield put(
          actions.createOrUpdateTopicLogValueResponse({
            error: textEncryptionKeyError.message,
          })
        )
        return
      }

      const [encryptedText, encryptionError] = yield call(
        lazyProtect(encryptText(textValue.text, textEncryptionKey))
      )
      if (encryptionError) {
        console.error("Encryption error occurred " + encryptionError.message)
        yield put(
          actions.createOrUpdateTopicLogValueResponse({
            error: encryptionError.message,
          })
        )
        return
      }

      textValue.text = encryptedText
    }
    body.encrypted = true
  }

  const [getOrCreateBody, getOrCreateError] = yield call(
    lazyProtect(
      axios.post(`${API_URL}/topiclogvalue/createorupdate`, body, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (getOrCreateError) {
    yield put(
      actions.createOrUpdateTopicLogValueResponse({
        error: getErrorMessage(getOrCreateError),
      })
    )
    return
  }

  yield put(
    actions.createOrUpdateTopicLogValueResponse({
      error: "",
      newValue: value,
      topic,
      topicLog,
      encrypted: body.encrypted,
    })
  )
}

export function* watchHandleGetTopicLogValues() {
  yield takeEvery(actions.getTopicLogValuesRequest, handleGetTopicLogValues)
}

function* handleGetTopicLogValues(action) {
  const topicLog: TopicLog = action.payload.topicLog

  const hash: string = yield call(getHash)

  const [getOrCreateBody, getOrCreateError] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/topiclogvalue/get/${topicLog.id}`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (getOrCreateError) {
    yield put(
      actions.getTopicLogValuesResponse({
        error: getErrorMessage(getOrCreateError),
      })
    )
    return
  }

  const topicLogValues: TopicLogValueContainer<TopicLogValue>[] = getOrCreateBody.data.data

  const [textEncryptionKey, textEncryptionKeyError] = yield call(
    getTextEncryptionKey
  )

  if (textEncryptionKeyError) {
    yield put(
      actions.getTopicLogValuesResponse({
        error: textEncryptionKeyError.message,
        topicLogValues: []
      })
    )
    return
  }

  yield decryptTopicLogValues(topicLogValues, textEncryptionKey)

  yield put(
    actions.getTopicLogValuesResponse({
      error: "",
      topicLogValues,
    })
  )
}

export function* watchHandleDeleteTopic() {
  yield takeEvery(actions.deleteTopicRequest, handleDeleteTopic)
}

function* handleDeleteTopic(action: any) {
  const hash: string = yield call(getHash)
  const topic: Topic | undefined = action.payload.topic
  if (!topic) throw new Error("topic may not be undefined in handleDeleteTopic")

  const [_, topicDeleteError] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/topic/delete/${topic.id}`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (topicDeleteError) {
    yield put(
      actions.deleteTopicResponse({
        error: getErrorMessage(topicDeleteError),
      })
    )
    return
  }

  yield put(
    actions.deleteTopicResponse({
      error: "",
      topic,
    })
  )
}

export function* watchHandleChangePriorityTopic() {
  yield takeEvery(actions.changePriorityTopicRequest, handleChangePriorityTopic)
}

function* handleChangePriorityTopic(action: any) {
  const hash: string = yield call(getHash)

  const topic: Topic | undefined = action.payload.topic
  const orderedTopics: Topic[] | undefined = action.payload.orderedTopics
  const newRank: number | undefined = action.payload.newRank
  if (!topic)
    throw new Error("topic may not be undefined in handleChangePriorityTopic")
  if (!orderedTopics)
    throw new Error(
      "orderedTopics may not be undefined in handleChangePriorityTopic"
    )
  if (newRank === null || newRank === undefined)
    throw new Error("newRank may not be undefined in handleChangePriorityTopic")

  const [topicUpdateBody, topicUpdateError] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/topic/edit`,
        {
          id: topic.id,
          rank: newRank,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (topicUpdateError) {
    yield put(
      actions.changePriorityTopicResponse({
        error: getErrorMessage(topicUpdateError),
      })
    )
    return
  }

  yield put(
    actions.changePriorityTopicResponse({
      error: "",
      topics: orderedTopics,
    })
  )
}

export function* watchHandleCreateTopic() {
  yield takeEvery(actions.createTopicRequest, handleCreateTopic)
}

function* handleCreateTopic(action: any) {
  const hash: string = yield call(getHash)
  const topic: Partial<Topic> | undefined = action.payload.topic
  if (!topic) throw new Error("topic may not be undefined in handleUpdateTopic")
  if (!topic.name) throw new Error("name must be provided for topic creation")
  if (!topic.typeInfo)
    throw new Error("typeInfo must be provided for topic creation")

  const [topicCreateBody, topicCreateError] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/topic/create`,
        {
          name: topic.name,
          description: topic.description || "",
          optional: topic.optional || false,
          typeInfo: topic.typeInfo,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (topicCreateError) {
    yield put(
      actions.createTopicResponse({
        error: getErrorMessage(topicCreateError),
      })
    )
    return
  }

  const newTopic = topicCreateBody.data.data

  yield put(
    actions.createTopicResponse({
      error: "",
      topic: newTopic,
    })
  )
}

export function* watchHandleUpdateTopic() {
  yield takeEvery(actions.updateTopicRequest, handleUpdateTopic)
}

function* handleUpdateTopic(action: any) {
  const hash: string = yield call(getHash)
  const topic: Topic | undefined = action.payload.topic
  if (!topic) throw new Error("topic may not be undefined in handleUpdateTopic")
  const recover: boolean | undefined = action.payload.recover

  const [topicUpdateBody, topicUpdateError] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/topic/edit`,
        {
          id: topic.id,
          name: topic.name,
          description: topic.description,
          optional: topic.optional,
          recover,
          hasVoice: topic.hasVoice,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (topicUpdateError) {
    yield put(
      actions.updateTopicResponse({
        error: getErrorMessage(topicUpdateError),
      })
    )
    return
  }

  topic.deleted = false

  yield put(
    actions.updateTopicResponse({
      error: "",
      topic,
    })
  )
}
