import * as React from "react"
import { bindActionCreators } from "redux"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { AuthActions } from "../redux/auth"
import { RootState } from "../redux"
import { withNavigation, NavigationInjectedProps } from "react-navigation"
import EncryptionContainer from "./EncryptionContainer"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
  loading: boolean
}

interface DispatchProps {
  authActions: typeof AuthActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

class Auth extends React.Component<Props, {}> {
  componentDidMount() {
    const { authenticated, loading, authActions } = this.props

    if (!authenticated && !loading) {
      authActions.autoLoginRequest()
    }
  }

  componentDidUpdate() {
    const { authenticated, loading, navigation } = this.props

    if (!authenticated && !loading) navigation.navigate("Intro")
  }

  render(): JSX.Element {
    const { children, authenticated } = this.props
    return authenticated ? (
      <EncryptionContainer>{children}</EncryptionContainer>
    ) : null
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const authenticated = state.auth.authenticated
  const loading = state.auth.loading

  return {
    authenticated,
    loading,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Auth))
