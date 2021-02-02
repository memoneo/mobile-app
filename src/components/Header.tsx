import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"
//import DrawerMenu from "./DrawerMenu"
import Logo from "./common/Logo"
import MText from "./common/MText"

interface Props {
  style: ViewStyle
}

const Header: React.FC<Props> = props => (
  <View style={StyleSheet.flatten([styles.headerContainer, props.style || {}])}>
    {/* <DrawerMenu style={{ position: "absolute" }} /> */}
    <View style={styles.innerHeaderContainer}>
      <Logo style={styles.logo} width={24} height={24} />
      <MText bold>Memoneo</MText>
    </View>
  </View>
)

export default Header

const styles = StyleSheet.create({
  headerContainer: {},
  innerHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginRight: 4,
  },
})
