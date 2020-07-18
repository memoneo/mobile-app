import { lazyProtect, Result } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import { take, call, put, takeEvery } from "redux-saga/effects"
import { API_URL } from "../../../config"
import axios, { AxiosResponse, AxiosError } from "axios"
import {
  defaultHeaders,
  authorizedHeader,
  getErrorMessage,
} from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"
import { User } from "../../../../memoneo-common/lib/types"
import { Topic } from "memoneo-common/lib/types"

export interface UserState {
  loading: boolean
  error: string
  ownUser?: User
  topics: Topic[]
}

const actionNames = {
  GET_USER_REQUEST: "GET_USER_REQUEST",
  GET_USER_RESPONSE: "GET_USER_RESPONSE",
}

const actions = {
  getUserRequest: createAction<any>(actionNames.GET_USER_REQUEST),
  getUserResponse: createAction<any>(actionNames.GET_USER_RESPONSE),
}

export const UserActions = actions

const initialUserState: UserState = {
  loading: false,
  error: "",
  topics: [],
}

export const userReducer = handleActions<UserState, any>(
  {
    [actionNames.GET_USER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.GET_USER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
  },
  initialUserState
)

export function* watchHandleGetUser() {
  yield takeEvery(actions.getUserRequest, handleGetUser)
}

function* handleGetUser() {
  const hash: string = yield call(getHash)

  const userResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.get(`${API_URL}/user/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (userResult.err) {
    yield put(
      actions.getUserResponse({
        error: getErrorMessage(userResult.err),
      })
    )
    return
  }

  const res = userResult.ok!

  const user: User = res.data.data

  yield put(
    actions.getUserResponse({
      error: "",
      ownUser: user,
    })
  )
}
