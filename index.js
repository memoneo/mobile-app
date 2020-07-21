import { AppRegistry, Platform } from "react-native"
import App from "./App"

AppRegistry.registerComponent("memoneo", () => App)

if (Platform.OS === "web") {
  const rootTag =
    document.getElementById("root") || document.getElementById("main")
  AppRegistry.runApplication("memoneo", { rootTag })
}

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"))
}
