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
import SettingsPerson from "./SettingsPerson"
import MButton from "../../components/common/MButton"
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

class Settings extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Settings",
    }
  }

  navigateTo = (screen: string) => {
    this.props.navigation.navigate(screen)
  }

  alertChangeEncryptionKey = () => {
    Alert.alert(
      "Warning",
      "This will change your text encryption key and can corrupt your data. Only confirm if you know what you are doing.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancelled recording"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("NotEncrypted"),
        },
      ],
      { cancelable: false }
    )
  }

  render(): JSX.Element {
    const { authActions } = this.props

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <SectionTitle title="Entries" />
          <Section>
            <TouchableOpacity
              onPress={() => this.navigateTo("Topic")}
              style={styles.settingsRow}>
              <Icon
                name="folder"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Topics</MText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.navigateTo("Goal")}
              style={styles.settingsRow}>
              <Icon
                name="wind"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Goal</MText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.navigateTo("Person")}
              style={styles.settingsRow}>
              <Icon
                name="user"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Persons</MText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.navigateTo("SelectionType")}
              style={styles.settingsRow}>
              <Icon
                name="merge-type"
                type="MaterialIcons"
                iconStyle={styles.settingsIcon}
              />
              <MText>Selection Types</MText>
            </TouchableOpacity>
          </Section>
          <SectionTitle title="Account" />
          <Section>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("PersonalData")}
              style={styles.settingsRow}>
              <Icon
                name="eye"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Personal data</MText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.alertChangeEncryptionKey()}
              style={styles.settingsRow}>
              <Icon
                name="unlock"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Encryption key</MText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => authActions.logout()}
              style={styles.settingsRow}>
              <Icon
                name="log-out"
                type="feather"
                iconStyle={styles.settingsIcon}
              />
              <MText>Log out</MText>
            </TouchableOpacity>
          </Section>
          <SectionTitle title="Help" />
          <Section>
            <View style={styles.helpMailText}>
              <MText>
                <MText>
                  If you have any suggestions, need explanations, etc., you can
                  contact me via mail at{" "}
                </MText>
                <MText focus onPress={() => openInbox()}>
                  {HELP_MAIL_ADDRESS}
                </MText>
                <MText>.</MText>
              </MText>
            </View>
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
)(withNavigation(Settings))

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
