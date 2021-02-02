import { createAction, handleActions } from "redux-actions"
import { take, call, put } from "redux-saga/effects"
import { lazyProtect } from "await-protect"
import { API_URL } from "../../../config"
import { axios } from "memoneo-common/lib/reexports"
import { getErrorMessage, defaultHeaders } from "memoneo-common/lib/utils/axios"

export interface PasswordRecoveryState {
  loading: boolean
  error: string
}

export const actionNames = {
  VERIFY_CODE_RESPONSE: "VERIFY_CODE_RESPONSE",
  VERIFY_CODE_REQUEST: "VERIFY_CODE_REQUEST",
  REQUEST_CODE_RESPONSE: "REQUEST_CODE_RESPONSE",
  REQUEST_CODE_REQUEST: "REQUEST_CODE_REQUEST",
}

export const actions = {
  verifyCodeResponse: createAction<Partial<PasswordRecoveryState>>(
    actionNames.VERIFY_CODE_RESPONSE
  ),
  verifyCodeRequest: createAction<Partial<PasswordRecoveryState>>(
    actionNames.VERIFY_CODE_REQUEST
  ),
  requestCodeResponse: createAction<Partial<PasswordRecoveryState>>(
    actionNames.REQUEST_CODE_RESPONSE
  ),
  requestCodeRequest: createAction<Partial<PasswordRecoveryState>>(
    actionNames.REQUEST_CODE_REQUEST
  ),
}
export const PasswordRecoveryActions = actions

export default actions

const initialState: PasswordRecoveryState = {
  loading: false,
  error: "",
}

export const passwordRecoveryReducer = handleActions<
  PasswordRecoveryState,
  Partial<PasswordRecoveryState>
>(
  {
    [actionNames.VERIFY_CODE_REQUEST]: (state, action) => {
      return {
        ...state,
        error: "",
        loading: true,
      }
    },
    [actionNames.VERIFY_CODE_RESPONSE]: (state, action) => {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    },
    [actionNames.REQUEST_CODE_REQUEST]: (state, action) => {
      return {
        ...state,
        error: "",
        loading: true,
      }
    },
    [actionNames.REQUEST_CODE_RESPONSE]: (state, action) => {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    },
  },
  initialState
)

export function* handleRequestCode() {
  while (true) {
    const action = yield take(actions.requestCodeRequest)
    const { mail } = action.payload
    if (!mail) {
      throw new Error("mail must be provided in action.payload")
    }

    const [_, err] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/user/recovery/forgotten`,
          { mail },
          { withCredentials: true, headers: { ...defaultHeaders } }
        )
      )
    )

    if (err) {
      yield put(actions.requestCodeResponse({ error: getErrorMessage(err) }))
      continue
    }

    yield put(actions.requestCodeResponse({ error: "" }))
  }
}

export function* handleVerifyCode() {
  while (true) {
    const action = yield take(actions.verifyCodeRequest)
    const { code } = action.payload
    if (!code) {
      throw new Error("code must be provided in action.payload")
    }

    const [_, err] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/user/recovery/verify`,
          { code },
          { withCredentials: true }
        )
      )
    )

    if (err) {
      yield put(actions.verifyCodeResponse({ error: getErrorMessage(err) }))
      continue
    }

    yield put(actions.verifyCodeResponse({ error: "" }))
  }
}
