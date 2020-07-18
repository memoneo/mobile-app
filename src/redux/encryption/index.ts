import { createAction, handleActions } from "redux-actions"
import { take, call, put } from "redux-saga/effects"
import { Result } from "await-protect"
import { getTextEncryptionKey, setTextEncryptionKey } from "../../lib/redux"

export interface EncryptionState {
  textEncryptionKey: string
  error: string
  initialLoadDone: boolean
}

export const actionNames = {
  RETRIEVE_KEY_REQUEST: "RETRIEVE_KEY_REQUEST",
  RETRIEVE_KEY_RESPONSE: "RETRIEVE_KEY_RESPONSE",
  INIT_KEY_REQUEST: "INIT_KEY_REQUEST",
  INIT_KEY_RESPONSE: "INIT_KEY_RESPONSE",
}

export const actions = {
  retrieveKeyResponse: createAction<Partial<EncryptionState>>(
    actionNames.RETRIEVE_KEY_RESPONSE
  ),
  retrieveKeyRequest: createAction<Partial<EncryptionState>>(
    actionNames.RETRIEVE_KEY_REQUEST
  ),
  initKeyRequest: createAction<Partial<EncryptionState>>(
    actionNames.INIT_KEY_REQUEST
  ),
  initKeyResponse: createAction<Partial<EncryptionState>>(
    actionNames.INIT_KEY_RESPONSE
  ),
}
export const EncryptionActions = actions

export default actions

const initialState: EncryptionState = {
  textEncryptionKey: "",
  error: "",
  initialLoadDone: false,
}

export const encryptionReducer = handleActions<
  EncryptionState,
  Partial<EncryptionState>
>(
  {
    [actionNames.RETRIEVE_KEY_REQUEST]: () => {
      return {
        error: "",
        initialLoadDone: false,
      }
    },
    [actionNames.RETRIEVE_KEY_RESPONSE]: (_, action) => {
      return {
        error: action.payload.error,
        initialLoadDone: true,
        textEncryptionKey: action.payload.textEncryptionKey,
      }
    },
    [actionNames.INIT_KEY_REQUEST]: (_, action) => {
      return {
        error: "",
      }
    },
    [actionNames.INIT_KEY_RESPONSE]: (_, action) => {
      return {
        error: action.payload.error,
        textEncryptionKey: action.payload.textEncryptionKey,
      }
    },
  },
  initialState
)

export function* handleRetrieveKey() {
  while (true) {
    yield take(actions.retrieveKeyRequest)

    const res: Result<string, Error> = yield call(getTextEncryptionKey)

    if (res.err) {
      yield put(
        actions.retrieveKeyResponse({
          error: "Unable to retrieve text encryption key.",
        })
      )
    }

    const key = !!res.ok ? res.ok : ""

    yield put(
      actions.retrieveKeyResponse({ error: "", textEncryptionKey: key })
    )
  }
}

export function* handleInitKey() {
  while (true) {
    const action = yield take(actions.initKeyRequest)
    const { textEncryptionKey } = action.payload

    const { err }: Result<void, Error> = yield call(
      setTextEncryptionKey,
      textEncryptionKey
    )

    if (err) {
      yield put(
        actions.initKeyResponse({
          error: "Unable to initialize text encryption key.",
        })
      )
    }

    yield put(actions.initKeyResponse({ error: "", textEncryptionKey }))
  }
}
