import { lazyProtect, Result } from "await-protect"
import { createAction, handleActions } from "redux-actions"
import { take, call, put, delay, takeEvery } from "redux-saga/effects"
import { API_URL } from "../../../config"
import axios, { AxiosResponse, AxiosError } from "axios"
import {
  defaultHeaders,
  authorizedHeader,
  getErrorMessage,
} from "memoneo-common/lib/utils/axios"
import { getHash } from "../../lib/redux"
import { Goal } from "memoneo-common/lib/types"
import { sortGoals } from "../../lib/sort"

export interface GoalState {
  loading: boolean
  loadingSaveValue: boolean
  loadingUpdate: boolean
  errorUpdate: string
  loadingCreate: boolean
  errorCreate: string
  loadingDelete: boolean
  errorDelete: string
  goals: Goal[]
  error: string
}

const actionNames = {
  CHANGE_PRIORITY_GOAL_REQUEST: "CHANGE_PRIORITY_GOAL_REQUEST",
  CHANGE_PRIORITY_GOAL_RESPONSE: "CHANGE_PRIORITY_GOAL_RESPONSE",
  GET_GOALS_REQUEST: "GET_GOALS_REQUEST",
  GET_GOALS_RESPONSE: "GET_GOALS_RESPONSE",
  UPDATE_GOAL_REQUEST: "UPDATE_GOAL_REQUEST",
  UPDATE_GOAL_RESPONSE: "UPDATE_GOAL_RESPONSE",
  DELETE_GOAL_REQUEST: "DELETE_GOAL_REQUEST",
  DELETE_GOAL_RESPONSE: "DELETE_GOAL_RESPONSE",
  CREATE_GOAL_REQUEST: "CREATE_GOAL_REQUEST",
  CREATE_GOAL_RESPONSE: "CREATE_GOAL_RESPNSE",
}

const actions = {
  changePriorityGoalRequest: createAction<any>(
    actionNames.CHANGE_PRIORITY_GOAL_REQUEST
  ),
  changePriorityGoalResponse: createAction<any>(
    actionNames.CHANGE_PRIORITY_GOAL_RESPONSE
  ),
  getGoalsRequest: createAction<any>(actionNames.GET_GOALS_REQUEST),
  getGoalsResponse: createAction<any>(actionNames.GET_GOALS_RESPONSE),
  updateGoalRequest: createAction<any>(actionNames.UPDATE_GOAL_REQUEST),
  updateGoalResponse: createAction<any>(actionNames.UPDATE_GOAL_RESPONSE),
  deleteGoalRequest: createAction<any>(actionNames.DELETE_GOAL_REQUEST),
  deleteGoalResponse: createAction<any>(actionNames.DELETE_GOAL_RESPONSE),
  createGoalRequest: createAction<any>(actionNames.CREATE_GOAL_REQUEST),
  createGoalResponse: createAction<any>(actionNames.CREATE_GOAL_RESPONSE),
}

export const GoalActions = actions

const initialGoalState: GoalState = {
  loading: false,
  loadingSaveValue: false,
  loadingDelete: false,
  errorDelete: "",
  loadingUpdate: false,
  errorUpdate: "",
  loadingCreate: false,
  errorCreate: "",
  goals: [],
  error: "",
}

export const goalReducer = handleActions<GoalState, any>(
  {
    [actionNames.GET_GOALS_REQUEST]: (state, action) => {
      return {
        ...state,
        loading: true,
        error: "",
      }
    },
    [actionNames.GET_GOALS_RESPONSE]: (state, action) => {
      const goals: Goal[] = action.payload.goals || []
      const error: string = action.payload.error || ""

      const goalMap: any = {}
      const subgoals: Goal[] = []
      for (let goal of goals) {
        goalMap[goal.id] = goal
        if (goal.parent) subgoals.push(goal)
      }

      for (let goal of subgoals) {
        goal.parent = goalMap[<string>goal.parent]
      }

      const sortedGoals = goals.sort(sortGoals)

      return {
        ...state,
        goals: sortedGoals,
        error,
        loading: false,
      }
    },
    [actionNames.DELETE_GOAL_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingDelete: true,
        errorDelete: "",
      }
    },
    [actionNames.DELETE_GOAL_RESPONSE]: (state: GoalState, action) => {
      const goal: Goal | undefined = action.payload.goal
      const error: string | undefined = action.payload.error
      const hardDeleted: boolean | undefined = action.payload.hardDeleted

      const newGoals: Goal[] = [...state.goals]

      if (!error) {
        goal.deleted = true

        if (hardDeleted) {
          const currentIndex = newGoals.findIndex((g) => g.id === goal.id)

          newGoals.splice(currentIndex, 1)
        }
      }

      return {
        ...state,
        loadingDelete: false,
        goals: newGoals,
      }
    },
    [actionNames.CHANGE_PRIORITY_GOAL_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingDelete: true,
        errorDelete: "",
      }
    },
    [actionNames.CHANGE_PRIORITY_GOAL_RESPONSE]: (state: GoalState, action) => {
      const goals: Goal[] | undefined = action.payload.goals
      const error: string | undefined = action.payload.error

      const newGoals: Goal[] = goals || [...state.goals]

      return {
        ...state,
        goals: newGoals,
      }
    },
    [actionNames.CREATE_GOAL_REQUEST]: (state, action) => {
      return {
        ...state,
        loadingCreate: true,
        errorCreate: "",
      }
    },
    /**
     * TODO there is still a bug
     */
    [actionNames.CREATE_GOAL_RESPONSE]: (state: GoalState, action) => {
      const goal: Goal | undefined = action.payload.goal
      const error: string | undefined = action.payload.error

      const newGoals: Goal[] = [...state.goals]
      if (goal && !error) {
        if (goal.parent) {
          const parentGoalIdx = newGoals.findIndex((g) => g.id === goal.parent)
          goal.parent = newGoals[parentGoalIdx]

          var insertIdx = parentGoalIdx + 1
          while (true) {
            if (insertIdx >= newGoals.length) {
              break
            }

            const nextGoal = newGoals[insertIdx]

            insertIdx += 1

            if ((<Goal>goal.parent).id !== nextGoal.parent) break
          }

          newGoals.splice(insertIdx, 0, goal)
        } else {
          newGoals.push(goal)
        }
      }

      return {
        ...state,
        errorCreate: error,
        loadingCreate: false,
        goals: newGoals,
      }
    },
    [actionNames.UPDATE_GOAL_REQUEST]: (state: GoalState) => {
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: "",
      }
    },
    [actionNames.UPDATE_GOAL_RESPONSE]: (state: GoalState, action) => {
      const goal: Goal | undefined = action.payload.goal
      const error: string | undefined = action.payload.error

      const newGoals: Goal[] = [...state.goals]

      if (!error) {
        const idx = newGoals.findIndex(
          (currentGoal) => currentGoal.id === goal.id
        )
        if (idx !== -1) {
          newGoals[idx] = goal
        }
      }

      return {
        ...state,
        loadingUpdate: false,
        goals: newGoals,
      }
    },
  },
  initialGoalState
)

export function* watchHandleGetGoals() {
  yield takeEvery(actions.getGoalsRequest, handleGetGoals)
}

function* handleGetGoals(action: any) {
  const hash: string = yield call(getHash)

  const goalsResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.get(`${API_URL}/goal/get`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (goalsResult.err) {
    yield put(
      actions.getGoalsResponse({
        error: getErrorMessage(goalsResult.err),
      })
    )
    return
  }

  const res = goalsResult.ok!

  const goals: Goal[] = res.data.data

  yield put(
    actions.getGoalsResponse({
      error: "",
      goals,
    })
  )
}

export function* watchHandleDeleteGoal() {
  yield takeEvery(actions.deleteGoalRequest, handleDeleteGoal)
}

function* handleDeleteGoal(action: any) {
  const hash: string = yield call(getHash)
  const goal: Goal | undefined = action.payload.goal
  if (!goal) throw new Error("goal may not be undefined in handleDeleteGoal")

  const goalDeleteResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.get(`${API_URL}/goal/delete/${goal.id}`, {
        withCredentials: true,
        headers: { ...defaultHeaders, ...authorizedHeader(hash) },
      })
    )
  )

  if (goalDeleteResult.err) {
    yield put(
      actions.deleteGoalResponse({
        error: getErrorMessage(goalDeleteResult.err),
      })
    )
    return
  }

  const hardDeleted = goalDeleteResult.ok.data.data || false

  yield put(
    actions.deleteGoalResponse({
      error: "",
      goal,
      hardDeleted,
    })
  )
}

export function* watchHandleChangePriorityGoal() {
  yield takeEvery(actions.changePriorityGoalRequest, handleChangePriorityGoal)
}

function* handleChangePriorityGoal(action: any) {
  const hash: string = yield call(getHash)

  const goal: Goal | undefined = action.payload.goal
  const orderedGoals: Goal[] | undefined = action.payload.orderedGoals
  const newRank: number | undefined = action.payload.newRank
  if (!goal)
    throw new Error("goal may not be undefined in handleChangePriorityGoal")
  if (!orderedGoals)
    throw new Error(
      "orderedGoals may not be undefined in handleChangePriorityGoal"
    )
  if (newRank === null || newRank === undefined)
    throw new Error("newRank may not be undefined in handleChangePriorityGoal")

  const goalUpdateResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/goal/edit`,
        {
          id: goal.id,
          rank: newRank,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (goalUpdateResult.err) {
    yield put(
      actions.changePriorityGoalResponse({
        error: getErrorMessage(goalUpdateResult.err),
      })
    )
    return
  }

  // TODO
  const sortedGoals = orderedGoals

  yield put(
    actions.changePriorityGoalResponse({
      error: "",
      goals: orderedGoals,
    })
  )
}

export function* watchHandleCreateGoal() {
  yield takeEvery(actions.createGoalRequest, handleCreateGoal)
}

function* handleCreateGoal(action: any) {
  const hash: string = yield call(getHash)
  const goal: Partial<Goal> | undefined = action.payload.goal
  const parent: Partial<Goal> | undefined = action.payload.parent
  if (!goal) throw new Error("goal may not be undefined in handleUpdateGoal")
  if (!goal.name) throw new Error("name must be provided for goal creation")

  const goalCreateResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/goal/create`,
        {
          name: goal.name,
          description: goal.description || "",
          parent: parent ? parent.id : null,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (goalCreateResult.err) {
    yield put(
      actions.createGoalResponse({
        error: getErrorMessage(goalCreateResult.err),
      })
    )
    return
  }

  const newGoal = goalCreateResult.ok!.data.data

  yield put(
    actions.createGoalResponse({
      error: "",
      goal: newGoal,
    })
  )
}

export function* watchHandleUpdateGoal() {
  yield takeEvery(actions.updateGoalRequest, handleUpdateGoal)
}

function* handleUpdateGoal(action: any) {
  const hash: string = yield call(getHash)
  const goal: Goal | undefined = action.payload.goal
  if (!goal) throw new Error("goal may not be undefined in handleUpdateGoal")
  const recover: boolean | undefined = action.payload.recover

  const goalUpdateResult: Result<AxiosResponse, AxiosError> = yield call(
    lazyProtect(
      axios.post(
        `${API_URL}/goal/edit`,
        {
          id: goal.id,
          name: goal.name,
          description: goal.description,
          progress: goal.progress,
          status: goal.status,
          recover,
        },
        {
          withCredentials: true,
          headers: { ...defaultHeaders, ...authorizedHeader(hash) },
        }
      )
    )
  )

  if (goalUpdateResult.err) {
    yield put(
      actions.updateGoalResponse({
        error: getErrorMessage(goalUpdateResult.err),
      })
    )
    return
  }

  if (recover) goal.deleted = false

  yield put(
    actions.updateGoalResponse({
      error: "",
      goal,
    })
  )
}
