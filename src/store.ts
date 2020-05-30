import createSagaMiddleware, { SagaMiddleware } from "redux-saga"
import { applyMiddleware, createStore, Middleware, compose } from "redux"
import { rootReducer, rootSaga } from "./redux"
import { createLogger } from "redux-logger"
import Reactotron from "../ReactotronConfig"

const { pathname } = window.location || {}
const IS_RUNNING_IN_CHROME = pathname && pathname.indexOf("debugger-ui")
const IS_PRODUCTION = process.env.NODE_ENV === "production"

let sagaMiddleware: SagaMiddleware<any>
if (IS_PRODUCTION) {
  sagaMiddleware = createSagaMiddleware()
} else {
  sagaMiddleware = createSagaMiddleware({
    sagaMonitor: Reactotron.createSagaMonitor(),
  })
}

const mw: Middleware[] = [sagaMiddleware]
if (!IS_PRODUCTION) {
  mw.push(createLogger({}))
}

const store = createStore(
  rootReducer,
  {},
  !IS_PRODUCTION
    ? compose(applyMiddleware(...mw), Reactotron.createEnhancer())
    : applyMiddleware(...mw)
)

sagaMiddleware.run(rootSaga)

export default store
