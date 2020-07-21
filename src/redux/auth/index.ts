import { createAction, handleActions } from "redux-actions"
import { AxiosResponse, AxiosError } from "axios"
import { take, call, put } from "redux-saga/effects"
import { lazyProtect, Result } from "await-protect"
import { SECURE_STORE_HASH_KEY, API_URL } from "../../../config"
import { SecureStore } from "../../lib/reexports"
import { axios } from "memoneo-common/lib/reexports"
import {
  getErrorMessage,
  authorizedHeader,
} from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"

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

    const { ok, err }: Result<AxiosResponse, AxiosError> = yield call(
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

    const { ok, err }: Result<AxiosResponse, AxiosError> = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/login`,
          { mail, password },
          { withCredentials: true }
        )
      )
    )

    if (err) {
      yield put(actions.loginResponse({ error: getErrorMessage(err) }))
      continue
    }

    const token = ok.data.data.token

    const hashResult: Result<void, Error> = yield call(
      lazyProtect(SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, token))
    )
    if (hashResult.err) {
      yield put(
        actions.loginResponse({
          error: hashResult.err.message,
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

    const { ok, err }: Result<AxiosResponse, AxiosError> = yield call(
      lazyProtect(
        axios.post(
          `${API_URL}/register`,
          { name, mail, password },
          { withCredentials: true }
        )
      )
    )

    if (err) {
      console.log(`Unable to call ${API_URL}/register`)
      yield put(actions.registerResponse({ error: getErrorMessage(err) }))
      continue
    }

    const token = ok.data.data.token

    const hashResult: Result<void, Error> = yield call(
      lazyProtect(SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, token))
    )
    if (hashResult.err) {
      yield put(
        actions.registerResponse({
          error: hashResult.err.message,
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

    yield call(
      lazyProtect(SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, null))
    )
  }
}
