import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { lazyProtect } from "await-protect"
import { SECURE_STORE_HASH_KEY, API_URL } from "../../../config"
import { SecureStore } from "../../lib/reexports"
import { axios } from "memoneo-common/lib/reexports"
import {
  getErrorMessage,
  authorizedHeader,
} from "memoneo-common/lib/utils/axios"
import { getHash, resetHash } from "../../lib/redux"

export interface AuthState {
  authenticated: boolean
  loading: boolean
  error: string
}

export const actionNames = {
  AUTO_LOGIN_RESPONSE: "AUTO_LOGIN_RESPONSE",
  AUTO_LOGIN_REQUEST: "AUTO_LOGIN_REQUEST",
  LOGIN_RESPONSE: "LOGIN_RESPONSE",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGOUT: "LOGOUT",
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_RESPONSE: "REGISTER_RESPONSE",
}

export const actions = {
  autoLoginResponse: createAction<Partial<AuthState>>(
    actionNames.AUTO_LOGIN_RESPONSE
  ),
  autoLoginRequest: createAction<Partial<AuthState>>(
    actionNames.AUTO_LOGIN_REQUEST
  ),
  loginResponse: createAction<Partial<AuthState>>(actionNames.LOGIN_RESPONSE),
  loginRequest: createAction<Partial<AuthState>>(actionNames.LOGIN_REQUEST),
  registerRequest: createAction<Partial<AuthState>>(
    actionNames.REGISTER_REQUEST
  ),
  registerResponse: createAction<Partial<AuthState>>(
    actionNames.REGISTER_RESPONSE
  ),
  logout: createAction<Partial<AuthState>>(actionNames.LOGOUT),
}
export const AuthActions = actions

export default actions

const initialState: AuthState = {
  loading: false,
  authenticated: false,
  error: "",
}

export const authReducer = handleActions<AuthState, Partial<AuthState>>(
  {
    [actionNames.REGISTER_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.REGISTER_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.LOGIN_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.LOGIN_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.AUTO_LOGIN_REQUEST]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: true,
      }
    },
    [actionNames.AUTO_LOGIN_RESPONSE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    },
    [actionNames.LOGOUT]: () => {
      return {
        loading: false,
        authenticated: false,
        error: "",
      }
    },
  },
  initialState
)

export function* handleAutoLogin() {
  while (true) {
    yield take(actions.autoLoginRequest)

    const hash: string = yield call(getHash)
    //console.log(`AutoLogin with hash ${hash}`)

    const [_, err] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/login`,
          {},
          { withCredentials: true, headers: { ...authorizedHeader(hash) } }
        )
      )
    )
    if (err) {
      //console.log(`Unable to AutoLogin due to ${getErrorMessage(err)}`)
      yield put(actions.autoLoginResponse({ authenticated: false }))
      continue
    }

    yield put(actions.autoLoginResponse({ authenticated: true }))
  }
}

export function* handleLogin() {
  while (true) {
    const action = yield take(actions.loginRequest)
    const { mail, password } = action.payload

    const [loginBody, loginErr] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/login`,
          { mail, password },
          { withCredentials: true }
        )
      )
    )

    if (loginErr) {
      yield put(actions.loginResponse({ error: getErrorMessage(loginErr) }))
      continue
    }

    const token = loginBody.data.data.token

    const [_, tokenSaveErr] = yield call(
      lazyProtect(SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, token))
    )
    if (tokenSaveErr) {
      yield put(
        actions.loginResponse({
          error: tokenSaveErr.message,
        })
      )
      continue
    }

    yield put(actions.loginResponse({ error: "", authenticated: true }))
  }
}

export function* handleRegister() {
  while (true) {
    const action = yield take(actions.registerRequest)
    const { name, mail, password } = action.payload

    const [registerBody, registerErr] = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/register`,
          { name, mail, password },
          { withCredentials: true }
        )
      )
    )

    if (registerErr) {
      console.log(`Unable to call ${API_URL}/register`)
      yield put(
        actions.registerResponse({ error: getErrorMessage(registerErr) })
      )
      continue
    }

    const token = registerBody.data.data.token

    const [_, tokenSaveErr] = yield call(
      lazyProtect(SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, token))
    )
    if (tokenSaveErr) {
      yield put(
        actions.registerResponse({
          error: tokenSaveErr.message,
        })
      )
      continue
    }

    yield put(actions.registerResponse({ error: "", authenticated: true }))
  }
}

export function* handleLogout() {
  while (true) {
    yield take(actions.logout)

    const err = yield call(resetHash)

    if (err) {
      console.warn(`Unable to resetHash to logout ${err}`)
    }
  }
}
