import React from "react"
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
import { openInbox } from "react-native-email-link"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { AuthActions } from "../../redux/auth"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import Section from "../../components/Section"
import SectionTitle from "../../components/SectionTitle"
import Auth from "../../components/Auth"
import MText from "../../components/common/MText"
import { Icon } from "react-native-elements"
import { textStandardColor } from "../../lib/colors"
import { HELP_MAIL_ADDRESS } from "../../../config"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
}

interface DispatchProps {
  authActions: typeof AuthActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

class SettingsPersonalData extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Personal data",
    }
  }

  navigateTo = (screen: string) => {
    this.props.navigation.navigate(screen)
  }

  render(): JSX.Element {
    const { authActions } = this.props

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <SectionTitle title="Account" />
          <Section>
            <TouchableOpacity
              onPress={() => this.navigateTo("ChangePassword")}
              style={styles.settingsRow}>
              <Icon
                name="unlock"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Password</MText>
            </TouchableOpacity>
          </Section>
        </SafeAreaView>
      </Auth>
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
)(withNavigation(SettingsPersonalData))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "stretch",
  },
  settingsRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  settingsIcon: {
    marginRight: 18,
    color: textStandardColor,
  },
  helpMailText: {},
})
