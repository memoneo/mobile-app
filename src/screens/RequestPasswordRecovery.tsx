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
  mail: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

const Schema = Yup.object().shape({
  mail: Yup.string().email("Invalid mail").required("Required"),
})

class RequestPasswordRecovery extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Login",
    }
  }

  handleSubmit = (values: FormProps) => {
    this.props.passwordRecoveryActions.requestCodeRequest({
      mail: values.mail,
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.loading && !this.props.loading) {
      if (!this.props.error) {
        this.props.navigation.navigate("VerifyRecoveryCode")
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
              initialValues={{ mail: "" }}
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
                    Mail
                  </MText>
                  <MInput
                    placeholder="Enter your mail..."
                    value={values.mail}
                    textContentType="emailAddress"
                    onBlur={handleBlur("mail")}
                    onChangeText={handleChange("mail")}
                  />
                  {errors.mail && touched.mail && <MError text={errors.mail} />}
                  <View style={styles.errorInfo}>
                    {error.length > 0 && <MError text={error} />}
                  </View>
                  <View style={styles.buttonContainer}>
                    <MButton
                      title="Request code"
                      loading={loading}
                      onPress={handleSubmit as any}
                    />
                    <MButton
                      buttonStyle={styles.buttonForgottenPassword}
                      title="Back to Login"
                      type="outline"
                      onPress={() => this.props.navigation.navigate("Login")}
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
