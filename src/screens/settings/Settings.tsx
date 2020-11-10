import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
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

  render(): JSX.Element {
    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <SectionTitle title="Topics" />
          <Section>
            <MText>Customize the type of questions that organize your diary.</MText>
            <MButton
              title="Edit Topics"
              onPress={() => this.navigateTo("Topic")}
            />
          </Section>
          <SectionTitle title="Goals" />
          <Section>
            <MText>Customize your goals.</MText>
            <MButton
              title="Edit Goals"
              onPress={() => this.navigateTo("Goal")}
            />
          </Section>
          <SectionTitle title="Selection Types" />
          <Section>
          <MText>Customize options for your selection topics.</MText>
            <MButton
              title="Edit Selection Types"
              onPress={() => this.navigateTo("SelectionType")}
            />
          </Section>
          <SectionTitle title="Persons" />
          <Section>
          <MText>Customize the persons which you can refer to in your diary.</MText>
            <MButton
              title="Edit Persons"
              onPress={() => this.navigateTo("Person")}
            />
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
    paddingVertical: 40,
    backgroundColor: "#fff",
    alignItems: "stretch",
  },
})
