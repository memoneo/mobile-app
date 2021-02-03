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

interface OwnProps {}

interface StateProps {
  loading: boolean
  error: string
}

interface DispatchProps {
  passwordRecoveryActions: typeof PasswordRecoveryActions
}

interface FormProps {
  code: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {
  code: string
}

const Schema = Yup.object().shape({
  code: Yup.string().required("Required"),
})

class RequestPasswordRecovery extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Login",
    }
  }

  handleSubmit = (values: FormProps) => {
    this.setState({ code: values.code }, () =>
      this.props.passwordRecoveryActions.verifyCodeRequest({
        code: values.code,
        mail: this.getMail(),
      })
    )
  }

  getMail = (): string => this.props.navigation.getParam("mail")

  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      if (!this.props.error && this.state.code) {
        this.props.navigation.navigate("ChangePassword", {
          mail: this.getMail(),
          code: this.state.code,
        })
      }
    }
  }

  render(): JSX.Element {
    const { loading, error } = this.props

    return (
      <NoAuth>
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <Header style={styles.logoContainer} />
            <Formik<FormProps>
              initialValues={{ code: "" }}
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
                  <MText h4 bold>
                    Code
                  </MText>
                  <MInput
                    placeholder="Code..."
                    value={values.code}
                    onBlur={handleBlur("code")}
                    onChangeText={handleChange("code")}
                  />
                  {errors.code && touched.code && <MError text={errors.code} />}
                  <View style={styles.errorInfo}>
                    {error.length > 0 && <MError text={error} />}
                  </View>
                  <View style={styles.buttonContainer}>
                    <MButton
                      title="Verify"
                      loading={loading}
                      onPress={handleSubmit as any}
                    />
                    <MButton
                      buttonStyle={styles.buttonForgottenPassword}
                      title="Resend code"
                      type="outline"
                      onPress={() =>
                        this.props.navigation.navigate(
                          "RequestPasswordRecovery"
                        )
                      }
                    />
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

  return {
    loading,
    error,
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
