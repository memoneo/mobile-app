import * as React from "react"
import { bindActionCreators } from "redux"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { RootState } from "../redux"
import { withNavigation, NavigationInjectedProps } from "react-navigation"
import { EncryptionActions } from "../redux/encryption"

interface OwnProps {}

interface StateProps {
  textEncryptionKey: string
  error: string
  initialLoadDone: boolean
}

interface DispatchProps {
  encryptionActions: typeof EncryptionActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

class EncryptionContainer extends React.Component<Props, {}> {
  componentDidMount() {
    const { encryptionActions, textEncryptionKey } = this.props
    if (!textEncryptionKey) {
      encryptionActions.retrieveKeyRequest()
    }
  }

  componentDidUpdate() {
    const { error, initialLoadDone } = this.props
    if (error) this.props.navigation.navigate("Error")
    if (initialLoadDone && !this.isEncrypted()) this.props.navigation.navigate("NotEncrypted")
  }

  isEncrypted = () => !this.props.error && !!this.props.textEncryptionKey

  render(): JSX.Element {
    const { children } = this.props

    return this.isEncrypted() ? (
      <React.Fragment>{children}</React.Fragment>
    ) : null
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const textEncryptionKey = state.key.textEncryptionKey
  const error = state.key.error
  const initialLoadDone = state.key.initialLoadDone

  return {
    textEncryptionKey,
    error,
    initialLoadDone,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    encryptionActions: bindActionCreators(EncryptionActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(EncryptionContainer))
