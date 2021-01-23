import React, { useEffect } from "react"
import { withNavigation, NavigationInjectedProps } from "react-navigation"
import NetInfo from "@react-native-community/netinfo"
import MError from "../components/common/MError"
import { APP_NAME } from "../../config"
import { StyleSheet, View } from "react-native"
import { Icon } from "react-native-elements"
import useInterval from "@use-it/interval"

interface OwnProps {}

interface StateProps {}

interface DispatchProps {}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

function NoNetwork(props: Props): JSX.Element {
  async function refresh() {
    const netInfo = await NetInfo.fetch()
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      props.navigation.navigate("Tab")
    }
  }

  useInterval(() => {
    refresh()
  }, 2000)

  return (
    <View style={styles.container}>
      <MError
        text={`You need network access to use ${APP_NAME}`}
        textStyle={{ marginBottom: 12 }}
      />
      <Icon name="refresh-ccw" type="feather" onPress={refresh} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
})

export default withNavigation(NoNetwork)
