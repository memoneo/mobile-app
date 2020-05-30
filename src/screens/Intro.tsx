import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { AuthActions } from "../redux/auth"
import { bindActionCreators } from "redux"
import { RootState } from "../redux"
import MText from "../components/common/MText"
import Logo from "../components/common/Logo"
import MButton from "../components/common/MButton"
import NoAuth from "../components/NoAuth"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
}

interface DispatchProps {
  authActions: typeof AuthActions
}

interface FormProps {
  mail: string
  password: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

class Intro extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Intro",
    }
  }

  navigateTo = (screen: string) => {
    console.log(screen)
    this.props.navigation.navigate(screen)
  }

  render(): JSX.Element {
    return (
      <NoAuth>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo width={92} height={92} />
            <MText bold>Memoneo</MText>
          </View>
          <View style={styles.headerContainer}>
            <MText h3 bold style={styles.headerText}>
              Raise your productivity with rigor.
            </MText>
          </View>
          <View style={styles.buttonContainer}>
            <MButton
              title="Register"
              onPress={() => this.navigateTo("Register")}
            />
            <MButton
              title="Log in"
              type="outline"
              onPress={() => this.navigateTo("Login")}
            />
          </View>
        </SafeAreaView>
      </NoAuth>
    )
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const authenticated = state.auth.authenticated
  return {
    authenticated,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Intro))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
    alignItems: "stretch",
  },
  buttonForgottenPassword: {
    marginTop: 10,
    height: 28,
  },
  headerText: {
    textAlign: "center",
  },
})
