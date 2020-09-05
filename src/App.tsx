import React from "react"
import { Provider } from "react-redux"
import { Audio } from "expo-av"

import Navigator from "./components/Navigator"
import store from "./store"
import { StatusBar } from "react-native"

interface State {
  isReady: boolean
  hasFontLoaded: boolean
}
export default class App extends React.PureComponent<{}, State> {
  async componentDidMount() {
    const audioPermissions = await Audio.getPermissionsAsync()
    if (!audioPermissions.granted) {
      await Audio.requestPermissionsAsync()
    }
  }

  render(): JSX.Element {
    return (
      <Provider store={store}>
        <StatusBar backgroundColor="black" />
        <Navigator />
      </Provider>
    )
  }

  private finishLoading = () => {
    this.setState((state: State) => {
      return {
        ...state,
        isReady: true,
      }
    })
  }

  private cacheResourcesAsync = async () => {
    // tslint:disable:no-require-imports no-floating-promises
    // tslint:enable:no-require-imports no-floating-promises
  }
}
