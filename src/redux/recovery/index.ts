import { createAction, handleActions } from "redux-actions"
import { take, call, put } from "redux-saga/effects"
import { lazyProtect } from "await-protect"
import { API_URL } from "../../../config"
import { axios } from "memoneo-common/lib/reexports"
import { getErrorMessage, defaultHeaders, authorizedHeader } from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"

export interface PasswordRecoveryState {
  loading: boolean
  error: string
}

export const actionNames = {
  VERIFY_CODE_RESPONSE: "VERIFY_CODE_RESPONSE",
  VERIFY_CODE_REQUEST: "VERIFY_CODE_REQUEST",
  REQUEST_CODE_RESPONSE: "REQUEST_CODE_RESPONSE",
  REQUEST_CODE_REQUEST: "REQUEST_CODE_REQUEST",
  UPDATE_PASSWORD_RESPONSE: "UPDATE_PASSWORD_RESPONSE",
  UPDATE_PASSWORD_REQUEST: "UPDATE_PASSWORD_REQUEST",
}

export const actions = {
  updatePasswordResponse: createAction<Partial<PasswordRecoveryState>>(
    actionNames.UPDATE_PASSWORD_RESPONSE
  ),
  updatePasswordRequest: createAction<Partial<PasswordRecoveryState>>(
    actionNames.UPDATE_PASSWORD_REQUEST
  ),
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
    [actionNames.UPDATE_PASSWORD_REQUEST]: (state, action) => {
      return {
        ...state,
        error: "",
        loading: true,
      }
    },
    [actionNames.UPDATE_PASSWORD_RESPONSE]: (state, action) => {
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      }
    },
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
    const { code, mail } = action.payload
    if (!code) {
      throw new Error("code must be provided in action.payload")
    }
    if (!mail) {
      throw new Error("mail must be provided in action.payload")
    }

    const [_, err] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/user/recovery/verify`,
          { code, mail },
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

export function* handleUpdatePassword() {
  while (true) {
    const action = yield take(actions.updatePasswordRequest)
    const { code, mail, oldPassword, password } = action.payload
    if (!code && !oldPassword) {
      throw new Error("code or oldPassword must be provided in action.payload")
    }
    if (!mail) {
      throw new Error("mail must be provided in action.payload")
    }
    if (!password) {
      throw new Error("password must be provided in action.payload")
    }

    const hash: string = yield call(getHash)

    const headers = hash ? { ...authorizedHeader(hash) } : {}

    const [_, err] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/user/password/change`,
          { code, mail, oldPassword, newPassword: password },
          { withCredentials: true, headers }
        )
      )
    )

    if (err) {
      yield put(actions.updatePasswordResponse({ error: getErrorMessage(err) }))
      continue
    }

    yield put(actions.updatePasswordResponse({ error: "" }))
  }
}
