import { lazyProtect } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import { call, put, takeEvery } from "redux-saga/effects"
import { API_URL } from "../../../config"
import axios, { AxiosResponse, AxiosError } from "axios"
import {
  defaultHeaders,
  authorizedHeader,
  getErrorMessage,
} from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"
import { Person } from "memoneo-common/lib/types"
import { sortBySurname } from "../../lib/sort"

export interface PersonState {
  loadingGetDelete: boolean
  loadingCreate: boolean
  persons: Person[]
  errorGetDelete: string
  errorCreate: string
}

const actionNames = {
  GET_PERSONS_REQUEST: "GET_PERSONS_REQUEST",
  GET_PERSONS_RESPONSE: "GET_PERSONS_RESPONSE",
  CREATE_PERSON_REQUEST: "CREATE_PERSON_REQUEST",
  CREATE_PERSON_RESPONSE: "CREATE_PERSON_RESPONSE",
  DELETE_PERSON_REQUEST: "DELETE_PERSON_REQUEST",
  DELETE_PERSON_RESPONSE: "DELETE_PERSON_RESPONSE",
}

const actions = {
  getPersonsRequest: createAction<any>(actionNames.GET_PERSONS_REQUEST),
  getPersonsResponse: createAction<any>(actionNames.GET_PERSONS_RESPONSE),
  createPersonRequest: createAction<any>(actionNames.CREATE_PERSON_REQUEST),
  createPersonResponse: createAction<any>(actionNames.CREATE_PERSON_RESPONSE),
  deletePersonRequest: createAction<any>(actionNames.DELETE_PERSON_REQUEST),
  deletePersonResponse: createAction<any>(actionNames.DELETE_PERSON_RESPONSE),
}

export const PersonActions = actions

const initialPersonState: PersonState = {
  loadingGetDelete: false,
  loadingCreate: false,
  persons: [],
  errorGetDelete: "",
  errorCreate: "",
}

export const personReducer = handleActions<PersonState, any>(
  {
    [actionNames.GET_PERSONS_REQUEST]: (state: PersonState, action) => {
      return {
        ...state,
        loadingGetDelete: true,
        errorGetDelete: "",
      }
    },
    [actionNames.GET_PERSONS_RESPONSE]: (state: PersonState, action) => {
      const error: string = action.payload.error
      const persons: Person[] = action.payload.persons || []

      return {
        ...state,
        loadingGetDelete: false,
        errorGetDelete: error,
        persons: persons.sort(sortBySurname),
      }
    },
    [actionNames.CREATE_PERSON_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingCreate: true,
        errorCreate: "",
      }
    },
    [actionNames.CREATE_PERSON_RESPONSE]: (state: PersonState, action) => {
      const error: string = action.payload.error
      const person: Person | undefined = action.payload.person

      let sortedPersons = [...state.persons]
      if (!error) {
        if (person) {
          sortedPersons.push(person)
        }

        sortedPersons = sortedPersons.sort(sortBySurname)
      }

      return {
        ...state,
        loadingCreate: false,
        errorCreate: error,
        persons: sortedPersons,
      }
    },
    [actionNames.DELETE_PERSON_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingGetDelete: true,
        errorGetDelete: "",
      }
    },
    [actionNames.DELETE_PERSON_RESPONSE]: (state: PersonState, action) => {
      const error: string = action.payload.error
      const deletePerson: Person | undefined = action.payload.person

      let sortedPersons: Person[] = [...state.persons]

      if (sortedPersons.length > 0 && !error) {
        if (deletePerson) {
          const idx = sortedPersons.findIndex(
            person => person.id === deletePerson.id
          )
          if (idx === -1) {
            throw Error(
              `DELETE_PERSON_RESPONSE may not request the deletion of a person that is not part of PersonState.persons`
            )
          }

          sortedPersons.splice(idx)
        }
      }

      return {
        ...state,
        loadingGetDelete: false,
        errorGetDelete: error,
        persons: sortedPersons,
      }
    },
  },
  initialPersonState
)

export function* watchHandleGetPersons() {
  yield takeEvery(actions.getPersonsRequest, handleGetPersons)
}

function* handleGetPersons() {
  const hash: string = yield call(getHash)

  const [body, err] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/person/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (err) {
    yield put(
      actions.getPersonsResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  const persons: Person[] = body.data.data

  yield put(
    actions.getPersonsResponse({
      error: "",
      persons,
    })
  )
}

export function* watchHandleCreatePerson() {
  yield takeEvery(actions.createPersonRequest, handleCreatePerson)
}

function* handleCreatePerson(action) {
  const name: string = action.payload.name
  const surname: string = action.payload.surname
  if (!name) throw Error(`name may not be null/empty in handleSaveRecording`)
  if (!surname)
    throw Error(`surname may not be null/empty in handleSaveRecording`)

  const hash: string = yield call(getHash)

  const [body, err] = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/person/create`,
        { name, surname },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (err) {
    yield put(
      actions.createPersonResponse({
        error: getErrorMessage(err),
      })
    )
  }

  const person: Person = body.data.data

  yield put(
    actions.createPersonResponse({
      error: "",
      person,
    })
  )
}

export function* watchHandleDeletePerson() {
  yield takeEvery(actions.deletePersonRequest, handleDeletePerson)
}

function* handleDeletePerson(action) {
  const person: Person = action.payload.person

  const hash: string = yield call(getHash)

  const [body, err] = yield call(
    lazyProtect(
      axios.get(`${API_URL}/person/${person.id}`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (err) {
    yield put(
      actions.deletePersonResponse({
        error: getErrorMessage(err),
      })
    )
    return
  }

  yield put(
    actions.deletePersonResponse({
      error: "",
      person,
    })
  )
}
