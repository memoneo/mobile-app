import { lazyProtect } from "await-protect"
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
import { User } from "memoneo-common/lib/types"
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
  CHANGE_MAIL_REQUEST: "CHANGE_MAIL_REQUEST",
  CHANGE_MAIL_RESPONSE: "CHANGE_MAIL_RESPONSE",
}

const actions = {
  getUserRequest: createAction<any>(actionNames.GET_USER_REQUEST),
  getUserResponse: createAction<any>(actionNames.GET_USER_RESPONSE),
  changeMailRequest: createAction<any>(actionNames.CHANGE_MAIL_REQUEST),
  changeMailResponse: createAction<any>(actionNames.CHANGE_MAIL_RESPONSE),
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
    [actionNames.CHANGE_MAIL_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
      }
    },
    [actionNames.CHANGE_MAIL_RESPONSE]: (state, action) => {
      const { mail, error } = action.payload
      if (!mail) {
        throw new Error(
          "mail must be inside CHANGE_MAIL_RESPONSE action payload"
        )
      }

      const newUser = { ...state.ownUser }
      if (!error) {
        newUser.mail = mail
      }

      return {
        ...state,
        ownUser: newUser,
        error,
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

  const [userBody, err] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/user/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (err) {
    yield put(
      actions.getUserResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const user: User = userBody.data.data

  yield put(
    actions.getUserResponse({
      error: "",
      ownUser: user,
    })
  )
}

export function* watchHandleChangeMail() {
  yield takeEvery(actions.changeMailRequest, handleChangeMail)
}

function* handleChangeMail(action: any) {
  const { password, newMail } = action.payload
  if (!newMail) {
    throw new Error("newMail must be provided in handleChangeMail")
  }

  if (!password) {
    throw new Error("password must be provided in handleChangeMail")
  }

  const hash: string = yield call(getHash)

  const [_, err] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/user/mail/change`,
        { mail: newMail, password },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (err) {
    yield put(
      actions.changeMailResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  yield put(
    actions.changeMailResponse({
      error: "",
      mail: newMail,
    })
  )
}
