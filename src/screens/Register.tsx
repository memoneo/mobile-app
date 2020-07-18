import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-elements"
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { Formik } from "formik"
import { AuthActions } from "../redux/auth"
import { bindActionCreators } from "redux"
import { RootState } from "../redux"
import MInput from "../components/common/MInput"
import MText from "../components/common/MText"
import Logo from "../components/common/Logo"
import MButton from "../components/common/MButton"
import { Yup } from "../lib/reexports"
import MError from "../components/common/MError"
import NoAuth from "../components/NoAuth"

interface OwnProps {}

interface StateProps {
  authenticated: boolean
  loading: boolean
  error: string
}

interface DispatchProps {
  authActions: typeof AuthActions
}

interface FormProps {
  mail: string
  password: string
  name: string
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface State {}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  mail: Yup.string()
    .email("Invalid mail")
    .required("Required"),
  password: Yup.string().required("Required"),
})

class Register extends React.PureComponent<Props, State> {
  static navigationOptions = (_: NavigationScreenProp<any>) => {
    return {
      headerTitle: "Register",
    }
  }

  componentDidMount(): void {
    //this.props.authActions.loginRequest()
  }

  handleSubmit = (values: FormProps) => {
    this.props.authActions.registerRequest({
      mail: values.mail,
      name: values.name,
      password: values.password,
    })
  }

  render(): JSX.Element {
    const { loading, error } = this.props

    return (
      <NoAuth>
        <SafeAreaView style={styles.container}>
          <Formik<FormProps>
            initialValues={{ mail: "", password: "", name: "" }}
            onSubmit={this.handleSubmit}
            validationSchema={RegisterSchema}>
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
                  Name
                </MText>
                <MInput
                  placeholder="Enter your name..."
                  value={values.name}
                  onBlur={handleBlur("name")}
                  onChangeText={handleChange("name")}
                />
                {errors.name && touched.name && <MError text={errors.name} />}
                <MText h4 bold>
                  Mail
                </MText>
                <MInput
                  placeholder="Enter your mail..."
                  value={values.mail}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onBlur={handleBlur("mail")}
                  onChangeText={handleChange("mail")}
                />
                {errors.mail && touched.mail && <MError text={errors.mail} />}
                <MText h4 bold>
                  Password
                </MText>
                <MInput
                  placeholder="Enter your password..."
                  value={values.password}
                  textContentType="password"
                  autoCompleteType="password"
                  secureTextEntry={true}
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                />
                {errors.password && touched.password && (
                  <MError text={errors.password} />
                )}
                <View style={styles.errorInfo}>
                  {error.length > 0 && <MError text={error} />}
                </View>
                <View style={styles.buttonContainer}>
                  <MButton
                    title="Register"
                    onPress={handleSubmit as any}
                    loading={loading}
                  />
                </View>
              </View>
            )}
          </Formik>
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
  const authenticated = state.auth.authenticated
  const loading = state.auth.loading
  const error = state.auth.error

  return {
    authenticated,
    loading,
    error,
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
)(withNavigation(Register))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    flex: 5,
    justifyContent: "flex-start",
  },
  errorInfo: {},
})
