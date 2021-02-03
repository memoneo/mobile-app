import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { Formik } from "formik"
import { bindActionCreators } from "redux"
import { RootState } from "../redux"
import MInput from "../components/common/MInput"
import MText from "../components/common/MText"
import MButton from "../components/common/MButton"
import { Yup } from "../lib/reexports"
import MError from "../components/common/MError"
import NoAuth from "../components/NoAuth"
import Header from "../components/Header"
import { PasswordRecoveryActions } from "../redux/recovery"
import { AuthActions } from "../redux/auth"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
  loading: boolean
  error: string
}

interface DispatchProps {
  passwordRecoveryActions: typeof PasswordRecoveryActions
  authActions: typeof AuthActions
}

interface FormProps {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

const Schema = Yup.object().shape({
  oldPassword: Yup.string(),
  newPassword: Yup.string().required("Required"),
  confirmNewPassword: Yup.string().required("Required"),
})

class RequestPasswordRecovery extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Login",
    }
  }

  handleSubmit = (values: FormProps) => {
    const mail = this.getMail()
    const code = this.getCode()

    this.props.passwordRecoveryActions.updatePasswordRequest({
      mail,
      code,
      password: values.newPassword,
    })
  }

  getMail = (): string => this.props.navigation.getParam("mail")
  getCode = (): string => this.props.navigation.getParam("code")

  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      if (!this.props.error) {
        if (this.props.authenticated) {
          this.props.authActions.logout()
        } else {
          this.props.navigation.navigate("Login")
        }
      }
    }
  }

  validate = (values: FormProps) => {
    const errors: { [key: string]: string } = {}

    if (values.newPassword !== values.confirmNewPassword) {
      errors["confirmNewPassword"] = "Password is not the same"
    }

    return errors
  }

  render(): JSX.Element {
    const { loading, error } = this.props

    return (
      <NoAuth>
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <Header style={styles.logoContainer} />
            <Formik<FormProps>
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              validate={this.validate}
              onSubmit={this.handleSubmit}
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
                  {false && (
                    <React.Fragment>
                      <MText h4 bold>
                        Old Password
                      </MText>
                      <MInput
                        placeholder="Old password..."
                        value={values.oldPassword}
                        textContentType="password"
                        onBlur={handleBlur("oldPassword")}
                        onChangeText={handleChange("oldPassword")}
                      />
                      {errors.oldPassword && touched.oldPassword && (
                        <MError text={errors.oldPassword} />
                      )}
                    </React.Fragment>
                  )}
                  <MText h4 bold>
                    New Password
                  </MText>
                  <MInput
                    placeholder="New password..."
                    value={values.newPassword}
                    textContentType="password"
                    secureTextEntry
                    onBlur={handleBlur("newPassword")}
                    onChangeText={handleChange("newPassword")}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <MError text={errors.newPassword} />
                  )}
                  <MText h4 bold>
                    Confirm Password
                  </MText>
                  <MInput
                    placeholder="Confirm..."
                    value={values.confirmNewPassword}
                    secureTextEntry
                    textContentType="password"
                    onBlur={handleBlur("confirmNewPassword")}
                    onChangeText={handleChange("confirmNewPassword")}
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <MError text={errors.confirmNewPassword} />
                  )}
                  <View style={styles.errorInfo}>
                    {error.length > 0 && <MError text={error} />}
                  </View>
                  <View style={styles.buttonContainer}>
                    <MButton
                      title="Change password"
                      loading={loading}
                      onPress={handleSubmit as any}
                    />
                    {true && (
                      <MButton
                        buttonStyle={styles.buttonForgottenPassword}
                        title="Back to Login"
                        type="outline"
                        onPress={() => this.props.navigation.navigate("Login")}
                      />
                    )}
                  </View>
                </View>
              )}
            </Formik>
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
  const loading = state.recovery.loading
  const error = state.recovery.error
  const authenticated = state.auth.authenticated

  return {
    loading,
    error,
    authenticated,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    passwordRecoveryActions: bindActionCreators(
      PasswordRecoveryActions,
      dispatch
    ),
    authActions: bindActionCreators(AuthActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(RequestPasswordRecovery))

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
