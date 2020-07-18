import Reactotron from "reactotron-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import sagaPlugin from "reactotron-redux-saga"
import { reactotronRedux } from "reactotron-redux"

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative()
  .use(sagaPlugin({}))
  .use(reactotronRedux())
  .connect()

export default Reactotron
