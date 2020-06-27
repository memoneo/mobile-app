import * as React from "react"
import { View, StyleSheet } from "react-native"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { User, Goal } from "memoneo-common/lib/types"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import Auth from "../../components/Auth"
import MText from "../../components/common/MText"
import { EncryptionActions } from "../../redux/encryption"
import { RootState } from "../../redux"
import MButton from "../../components/common/MButton"
import MInput from "../../components/common/MInput"
import { borderRadius } from "../../lib/colors"

interface OwnProps {}

interface StateProps {
  textEncryptionKey: string
  error: string
  authenticated: boolean
}

interface DispatchProps {
  encryptionActions: typeof EncryptionActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  encryptionKey: string
}

class EnterEncryptionKey extends React.PureComponent<Props, State> {
  state = {
    encryptionKey: "",
  }

  componentDidMount() {
    this.checkRenavigate()
  }

  componentDidUpdate() {
    this.checkRenavigate()
  }

  checkRenavigate = () => {
    const { textEncryptionKey, navigation, error, authenticated } = this.props

    if (!!textEncryptionKey) {
      navigation.navigate("Home")
    } else if (error) {
      navigation.navigate("Error")
    } else if (!authenticated) {
      navigation.navigate("Login")
    }
  }

  addKey = () =>
    this.props.encryptionActions.initKeyRequest({
      textEncryptionKey: this.state.encryptionKey,
    })

  render(): JSX.Element {
    return (
      <View style={styles.main}>
        <View style={styles.header}>
          <MText h3 bold>
            Enter your encryption key
          </MText>
        </View>
        <View style={styles.description}>
          <MText style={styles.descriptionText1}>
            Before using Memoneo, we need you to set your key with whom we
            encrypt the text contents you write on this app. This is to ensure
            that only your devices can access your data.
          </MText>
          <MText>
            If you are installing Memoneo on a new device, make sure to use the
            same encryption key.
          </MText>
        </View>
        <View style={styles.encryptionKeyInput}>
          <MInput
            value={this.state.encryptionKey}
            onChangeText={(v) => this.setState({ encryptionKey: v })}
          />
        </View>
        <View style={styles.createButton}>
          <MButton title="Add" onPress={this.addKey} />
        </View>
        <View style={styles.warningContainer}>
          <MText>
            Note: if you lose access to this phone and your key as well, your
            data will be lost! Write it down somewhere.
          </MText>
          <MText>Treat this as more important than your password.</MText>
        </View>
      </View>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const textEncryptionKey = state.key.textEncryptionKey
  const error = state.key.error
  const authenticated = state.auth.authenticated

  return {
    textEncryptionKey,
    error,
    authenticated,
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
)(withNavigation(EnterEncryptionKey))

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 16,
  },
  children: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  encryptionKeyInput: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 16,
  },
  descriptionText1: {
    marginBottom: 8,
  },
  createButton: {
    marginBottom: 20,
  },
  warningContainer: {
    backgroundColor: "#ffe03a",
    padding: 12,
    borderRadius: borderRadius,
  },
})
