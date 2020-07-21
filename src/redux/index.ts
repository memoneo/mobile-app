import { fork } from "redux-saga/effects"

import { combineReducers } from "redux"
import {
  TopicState,
  topicReducer,
  watchHandleGetTopics,
  watchHandleCreateOrUpdateTopicLogValue,
  handleGetOrCreateTopicLog,
  watchHandleGetTopicLogValues,
  watchHandleGetTopicLogs,
  watchHandleDeleteTopic,
  watchHandleUpdateTopic,
  watchHandleCreateTopic,
  watchHandleChangePriorityTopic,
} from "./topic"
import {
  handleLogin,
  handleRegister,
  handleLogout,
  AuthState,
  authReducer,
  handleAutoLogin,
} from "./auth"
import { UserState, watchHandleGetUser, userReducer } from "./user"
import {
  RecordingState,
  recordingReducer,
  handleGetRecordings,
  watchHandleSaveRecording,
} from "./recording"
import {
  watchHandleGetSelectionType,
  SelectionTypeState,
  selectionTypeReducer,
  watchHandleGetSelectionTypes,
  watchHandleCreateSelectionType,
  watchHandleAddItemToSelectionType,
  watchHandleDeleteItemFromSelectionType,
} from "./selectionType"
import {
  watchHandleGetPersons,
  watchHandleDeletePerson,
  watchHandleCreatePerson,
  PersonState,
  personReducer,
} from "./person"
import {
  goalReducer,
  GoalState,
  watchHandleGetGoals,
  watchHandleCreateGoal,
  watchHandleDeleteGoal,
  watchHandleUpdateGoal,
  watchHandleChangePriorityGoal,
} from "./goal"
import {
  EncryptionState,
  encryptionReducer,
  handleInitKey,
  handleRetrieveKey,
} from "./encryption"

export interface RootState {
  topic: TopicState
  auth: AuthState
  recording: RecordingState
  user: UserState
  selectionType: SelectionTypeState
  person: PersonState
  goal: GoalState
  key: EncryptionState
}

export const rootReducer = combineReducers<RootState>({
  topic: topicReducer,
  auth: authReducer,
  user: userReducer,
  recording: recordingReducer,
  selectionType: selectionTypeReducer,
  person: personReducer,
  goal: goalReducer,
  key: encryptionReducer,
})

export function* rootSaga() {
  yield fork(watchHandleGetTopics)
  yield fork(watchHandleGetUser)

  yield fork(handleAutoLogin)
  yield fork(handleLogin)
  yield fork(handleRegister)
  yield fork(handleLogout)

  yield fork(handleGetRecordings)
  yield fork(watchHandleSaveRecording)

  yield fork(watchHandleGetTopicLogValues)
  yield fork(watchHandleCreateOrUpdateTopicLogValue)
  yield fork(handleGetOrCreateTopicLog)
  yield fork(watchHandleGetTopicLogs)
  yield fork(watchHandleDeleteTopic)
  yield fork(watchHandleUpdateTopic)
  yield fork(watchHandleCreateTopic)
  yield fork(watchHandleChangePriorityTopic)

  yield fork(watchHandleGetSelectionType)
  yield fork(watchHandleGetSelectionTypes)
  yield fork(watchHandleCreateSelectionType)
  yield fork(watchHandleAddItemToSelectionType)
  yield fork(watchHandleDeleteItemFromSelectionType)

  yield fork(watchHandleGetPersons)
  yield fork(watchHandleDeletePerson)
  yield fork(watchHandleCreatePerson)

  yield fork(watchHandleGetGoals)
  yield fork(watchHandleCreateGoal)
  yield fork(watchHandleDeleteGoal)
  yield fork(watchHandleUpdateGoal)
  yield fork(watchHandleChangePriorityGoal)

  yield fork(handleInitKey)
  yield fork(handleRetrieveKey)
}
