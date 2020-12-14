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
import { SelectionType, SelectionTypeItem } from "memoneo-common/lib/types"

export interface SelectionTypeState {
  loadingGet: boolean
  errorGet: string
  loadingCreate: boolean
  errorCreate: string
  loadingAddItem: boolean
  errorAddItem: string
  loadingRemoveItem: boolean
  errorRemoveItem: string
  selectionTypeMap: SelectionTypeMap
}

export type SelectionTypeMap = { [selectionTypeId: string]: SelectionType }

const actionNames = {
  GET_SELECTION_TYPE_REQUEST: "GET_SELECTION_TYPE_REQUEST",
  GET_SELECTION_TYPE_RESPONSE: "GET_SELECTION_TYPE_RESPONSE",
  GET_SELECTION_TYPES_REQUEST: "GET_SELECTION_TYPES_REQUEST",
  GET_SELECTION_TYPES_RESPONSE: "GET_SELECTION_TYPES_RESPONSE",
  CREATE_SELECTION_TYPE_REQUEST: "CREATE_SELECTION_TYPE_REQUEST",
  CREATE_SELECTION_TYPE_RESPONSE: "CREATE_SELECTION_TYPE_RESPONSE",
  ADD_ITEM_TO_SELECTION_TYPE_REQUEST: "ADD_ITEM_TO_SELECTION_TYPE_REQUEST",
  ADD_ITEM_TO_SELECTION_TYPE_RESPONSE: "ADD_ITEM_TO_SELECTION_TYPE_RESPONSE",
  DELETE_ITEM_FROM_SELECTION_TYPE_REQUEST:
    "DELETE_ITEM_FROM_SELECTION_TYPE_REQUEST",
  DELETE_ITEM_FROM_SELECTION_TYPE_RESPONSE:
    "DELETE_ITEM_FROM_SELECTION_TYPE_RESPONSE",
}

const actions = {
  getSelectionTypeRequest: createAction<any>(
    actionNames.GET_SELECTION_TYPE_REQUEST
  ),
  getSelectionTypeResponse: createAction<any>(
    actionNames.GET_SELECTION_TYPE_RESPONSE
  ),
  getSelectionTypesRequest: createAction<any>(
    actionNames.GET_SELECTION_TYPES_REQUEST
  ),
  getSelectionTypesResponse: createAction<any>(
    actionNames.GET_SELECTION_TYPES_RESPONSE
  ),
  createSelectionTypeRequest: createAction<any>(
    actionNames.CREATE_SELECTION_TYPE_REQUEST
  ),
  createSelectionTypeResponse: createAction<any>(
    actionNames.CREATE_SELECTION_TYPE_RESPONSE
  ),
  addItemToSelectionTypeRequest: createAction<any>(
    actionNames.ADD_ITEM_TO_SELECTION_TYPE_REQUEST
  ),
  addItemToSelectionTypeResponse: createAction<any>(
    actionNames.ADD_ITEM_TO_SELECTION_TYPE_RESPONSE
  ),
  deleteItemFromSelectionTypeRequest: createAction<any>(
    actionNames.DELETE_ITEM_FROM_SELECTION_TYPE_REQUEST
  ),
  deleteItemFromSelectionTypeResponse: createAction<any>(
    actionNames.DELETE_ITEM_FROM_SELECTION_TYPE_RESPONSE
  ),
}

export const SelectionTypeActions = actions

const initialSelectionTypeState: SelectionTypeState = {
  loadingGet: false,
  errorGet: "",
  loadingCreate: false,
  errorCreate: "",
  loadingAddItem: false,
  errorAddItem: "",
  loadingRemoveItem: false,
  errorRemoveItem: "",
  selectionTypeMap: {},
}

export const selectionTypeReducer = handleActions<SelectionTypeState, any>(
  {
    [actionNames.GET_SELECTION_TYPE_REQUEST]: (
      state: SelectionTypeState,
      action
    ) => {
      return {
        ...state,
        loadingGet: true,
        errorGet: "",
      }
    },
    [actionNames.GET_SELECTION_TYPE_RESPONSE]: (
      state: SelectionTypeState,
      action
    ) => {
      const selectionTypeMap = { ...state.selectionTypeMap }
      const newSelectionType: SelectionType | undefined =
        action.payload.selectionType
      const error: string = action.payload.error

      if (newSelectionType && !newSelectionType.deleted) {
        selectionTypeMap[newSelectionType.id] = newSelectionType
      }

      return {
        ...state,
        loadingGet: false,
        errorGet: error,
        selectionTypeMap,
      }
    },
    [actionNames.GET_SELECTION_TYPES_REQUEST]: (
      state: SelectionTypeState,
      action
    ) => {
      return {
        ...state,
        loadingGet: true,
        errorGet: "",
      }
    },
    [actionNames.GET_SELECTION_TYPES_RESPONSE]: (
      state: SelectionTypeState,
      action
    ) => {
      const selectionTypeMap: SelectionTypeMap = {}
      const error: string = action.payload.error

      const selectionTypes: SelectionType[] =
        action.payload.selectionTypes || []
      selectionTypes.forEach(selectionType => {
        selectionTypeMap[selectionType.id] = selectionType
        selectionType.items = selectionType.items.filter(item => item.deleted)
      })

      return {
        ...state,
        loadingGet: false,
        errorGet: error,
        selectionTypeMap,
      }
    },
    [actionNames.CREATE_SELECTION_TYPE_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingCreate: true,
        errorCreate: "",
      }
    },
    [actionNames.CREATE_SELECTION_TYPE_RESPONSE]: (
      state: SelectionTypeState,
      action
    ) => {
      const selectionTypeMap = { ...state.selectionTypeMap }

      const newSelectionType: SelectionType | undefined =
        action.payload.selectionType
      const error: string = action.payload.error

      if (newSelectionType) {
        selectionTypeMap[newSelectionType.id] = newSelectionType
      }

      return {
        ...state,
        loadingCreate: false,
        errorCreate: error,
        selectionTypeMap,
      }
    },
    [actionNames.ADD_ITEM_TO_SELECTION_TYPE_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingAddItem: true,
        errorAddItem: "",
      }
    },
    [actionNames.ADD_ITEM_TO_SELECTION_TYPE_RESPONSE]: (
      state: SelectionTypeState,
      action
    ) => {
      const selectionTypeMap = { ...state.selectionTypeMap }

      const selectionType: SelectionType | undefined =
        action.payload.selectionType
      const error: string = action.payload.error

      if (!error) {
        selectionType.items = selectionType.items.filter(item => item.deleted)

        selectionTypeMap[selectionType.id] = selectionType
      }

      return {
        ...state,
        loadingAddItem: false,
        errorAddItem: error,
        selectionTypeMap,
      }
    },
    [actionNames.DELETE_ITEM_FROM_SELECTION_TYPE_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingDeleteItem: true,
        errorDeleteItem: "",
      }
    },
    [actionNames.DELETE_ITEM_FROM_SELECTION_TYPE_RESPONSE]: (
      state: SelectionTypeState,
      action
    ) => {
      const selectionTypeMap = { ...state.selectionTypeMap }

      const selectionType: SelectionType | undefined =
        action.payload.selectionType
      const error: string = action.payload.error

      selectionType.items = selectionType.items.filter(item => item.deleted)

      selectionTypeMap[selectionType.id] = selectionType

      return {
        ...state,
        loadingDeleteItem: false,
        errorDeleteItem: error,
        selectionTypeMap,
      }
    },
  },
  initialSelectionTypeState
)

export function* watchHandleGetSelectionType() {
  yield takeEvery(actions.getSelectionTypeRequest, handleGetSelectionType)
}

function* handleGetSelectionType(action) {
  const hash: string = yield call(getHash)
  const selectionTypeId: string = action.payload.selectionTypeId

  const [selectionTypeBody, err] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/selectiontype/get/${selectionTypeId}`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (err) {
    yield put(
      actions.getSelectionTypeResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const selectionType: SelectionType = selectionTypeBody.data.data

  yield put(
    actions.getSelectionTypeResponse({
      error: "",
      selectionType,
    })
  )
}

export function* watchHandleGetSelectionTypes() {
  yield takeEvery(actions.getSelectionTypesRequest, handleGetSelectionTypes)
}

function* handleGetSelectionTypes() {
  const hash: string = yield call(getHash)

  const [selectionTypesBody, err] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/selectiontype/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (err) {
    yield put(
      actions.getSelectionTypesResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const selectionTypes: SelectionType[] = selectionTypesBody.data.data

  yield put(
    actions.getSelectionTypesResponse({
      error: "",
      selectionTypes,
    })
  )
}

export function* watchHandleCreateSelectionType() {
  yield takeEvery(actions.createSelectionTypeRequest, handleCreateSelectionType)
}

function* handleCreateSelectionType(action) {
  const hash: string = yield call(getHash)

  const name: string | undefined = action.payload.name
  if (!name) throw Error("name in handleCreateSelectionType may not be empty")

  const [body, err] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/selectiontype/create`,
        { displayName: name },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (err) {
    yield put(
      actions.createSelectionTypeResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const selectionType: SelectionType = body.data.data

  yield put(
    actions.createSelectionTypeResponse({
      error: "",
      selectionType,
    })
  )
}

export function* watchHandleAddItemToSelectionType() {
  yield takeEvery(
    actions.addItemToSelectionTypeRequest,
    handleAddItemToSelectionType
  )
}

function* handleAddItemToSelectionType(action) {
  const hash: string = yield call(getHash)

  const selectionType: SelectionType | undefined = action.payload.selectionType
  const name: string | undefined = action.payload.name
  if (!selectionType)
    throw Error(
      "selectionType in handleAddItemToSelectionType may not be undefined"
    )
  if (!name)
    throw Error("name in handleAddItemToSelectionType may not be undefined")

  const [body, err] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/selectiontype/item/add/${selectionType.id}`,
        { displayName: name },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (err) {
    yield put(
      actions.addItemToSelectionTypeResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const newSelectionType: SelectionType = body.data.data

  yield put(
    actions.addItemToSelectionTypeResponse({
      error: "",
      selectionType: newSelectionType,
    })
  )
}

export function* watchHandleDeleteItemFromSelectionType() {
  yield takeEvery(
    actions.deleteItemFromSelectionTypeRequest,
    handleDeleteItemFromSelectionType
  )
}

function* handleDeleteItemFromSelectionType(action) {
  const hash: string = yield call(getHash)

  const selectionType: SelectionType | undefined = action.payload.selectionType
  const selectionTypeItem: SelectionTypeItem | undefined =
    action.payload.selectionTypeItem

  if (!selectionType)
    throw Error(
      "selectionType in handleDeleteItemFromSelectionType may not be undefined"
    )
  if (!selectionTypeItem)
    throw Error(
      "selectionTypeItem in handleDeleteItemFromSelectionType may not be undefined"
    )

  const [body, err] = yield call(
    lazyProtect(
      axios.get(
        `${API_URL}/selectiontype/item/delete/${selectionType.id}/${selectionTypeItem.id}`,
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (err) {
    yield put(
      actions.deleteItemFromSelectionTypeResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const newSelectionType: SelectionType = body.data.data

  yield put(
    actions.deleteItemFromSelectionTypeResponse({
      error: "",
      newSelectionType,
    })
  )
}
