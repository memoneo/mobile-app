import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { Formik, FormikErrors } from "formik"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import MInput from "../../components/common/MInput"
import MText from "../../components/common/MText"
import MButton from "../../components/common/MButton"
import { Yup } from "../../lib/reexports"
import MError from "../../components/common/MError"
import NoAuth from "../../components/NoAuth"
import Header from "../../components/Header"
import { PasswordRecoveryActions } from "../../redux/recovery"
import { AuthActions } from "../../redux/auth"
import Auth from "../../components/Auth"
import { UserActions } from "../../redux/user"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
  loading: boolean
  error: string
  mail?: string
}

interface DispatchProps {
  userActions: typeof UserActions
}

interface FormProps {
  password: string
  mail: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

const Schema = Yup.object().shape({
  password: Yup.string(),
  mail: Yup.string().email().required("Required"),
})

class ChangeMail extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Change Mail",
    }
  }

  handleSubmit = (values: FormProps) => {
    this.props.userActions.getUserRequest({
      mail: values.mail,
      password: values.password,
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      if (!this.props.error) {
        this.props.navigation.navigate("Settings")
      }
    }
  }

  render(): JSX.Element {
    return (
      <Auth>
        <Inner {...this.props} handleSubmit={this.handleSubmit} />
      </Auth>
    )
  }
}

interface InnerProps extends Props {
  handleSubmit: (values: FormProps) => void
}

function Inner(props: InnerProps) {
  const { loading, error, handleSubmit, navigation, authenticated } = props

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Header style={styles.logoContainer} />
        <Formik<FormProps>
          initialValues={{
            password: "",
            mail: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={Schema}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <MText h4 bold>
                Password
              </MText>
              <MInput
                placeholder="Enter password..."
                value={values.password}
                textContentType="password"
                secureTextEntry
                onBlur={handleBlur("password")}
                onChangeText={handleChange("password")}
              />
              {errors.password && touched.password && (
                <MError text={errors.password} />
              )}
              <MText h4 bold>
                New mail
              </MText>
              <MInput
                placeholder="Enter new mail address..."
                value={values.mail}
                onBlur={handleBlur("mail")}
                onChangeText={handleChange("mail")}
              />
              {errors.mail && touched.mail && (
                <MError text={errors.mail} />
              )}
              <View style={styles.errorInfo}>
                {error.length > 0 && <MError text={error} />}
              </View>
              <View style={styles.buttonContainer}>
                <MButton
                  title="Change mail"
                  loading={loading}
                  onPress={handleSubmit as any}
                />
                <MButton
                  buttonStyle={styles.buttonForgottenPassword}
                  title="Back to Settings"
                  type="outline"
                  onPress={() => navigation.navigate("Settings")}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  )
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const loading = state.recovery.loading
  const error = state.recovery.error
  const authenticated = state.auth.authenticated
  const mail = state.user.ownUser?.mail ?? ""

  return {
    loading,
    error,
    authenticated,
    mail,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    userActions: bindActionCreators(
      UserActions,
      dispatch
    ),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(ChangeMail))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "60%",
    flex: 1,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 16,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },
  buttonForgottenPassword: {
    marginTop: 10,
    height: 28,
  },
  formContainer: {
    flex: 6,
  },
  errorInfo: {},
})
