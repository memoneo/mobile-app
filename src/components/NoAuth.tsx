import * as React from "react"
import { bindActionCreators } from "redux"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { AuthActions } from "../redux/auth"
import { RootState } from "../redux"
import { withNavigation, NavigationInjectedProps } from "react-navigation"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
  loading: boolean
}

interface DispatchProps {
  authActions: typeof AuthActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

class NoAuth extends React.Component<Props, {}> {
  componentDidMount() {
    const { authenticated, loading, authActions, navigation } = this.props

    if (!authenticated && !loading) {
      authActions.autoLoginRequest()
    } else if (authenticated) {
      navigation.navigate("Home")
    }
  }

  componentDidUpdate() {
    const { authenticated, loading, navigation } = this.props

    if (authenticated && !loading) navigation.navigate("Home")
  }

  render(): JSX.Element {
    const { children, authenticated } = this.props
    return !authenticated ? <React.Fragment>{children}</React.Fragment> : null
  }
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const authenticated = state.auth.authenticated
  const loading = state.auth.loading

  return {
    authenticated,
    loading,
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
)(withNavigation(NoAuth))
