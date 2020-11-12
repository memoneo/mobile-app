import React from "react"
import { View, StyleSheet } from "react-native"
import { NavigationInjectedProps, SafeAreaView, withNavigation } from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import { PersonActions } from "../../redux/person"
import { Person } from "memoneo-common/lib/types"
import { Yup } from "../../lib/reexports"
import { Formik, FormikProps } from "formik"
import MText from "../../components/common/MText"
import MInput from "../../components/common/MInput"
import MError from "../../components/common/MError"
import MButton from "../../components/common/MButton"
import { fontSizeSmall } from "../../lib/styleVars"
import Auth from "../../components/Auth"

interface OwnProps {}

interface StateProps {
  loadingCreate: boolean
  errorCreate: string
}

interface DispatchProps {
  personActions: typeof PersonActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface FormProps {
  name: string
  surname: string
}

const PersonSchema = Yup.object().shape({
  name: Yup.string().min(1).max(32).required("Name is required"),
  surname: Yup.string().max(32).required("Surname is required"),
})

interface State {}

class PersonSettingsAdd extends React.PureComponent<Props, State> {
  formikRef = React.createRef()

  constructor(props: Props) {
    super(props)

    this.formikRef = React.createRef()
  }

  componentDidMount() {
    this.props.personActions.getPersonsRequest()
  }

  componentDidUpdate(oldProps: Props) {
    if (
      oldProps.loadingCreate &&
      !this.props.loadingCreate &&
      !this.props.errorCreate
    ) {
      this.props.navigation.navigate("Person")
    }
  }

  handleSubmit = (values: FormProps, { resetForm }) => {
    this.props.personActions.createPersonRequest({
      name: values.name,
      surname: values.surname,
    })
  }

  deletePerson = (person: Person) => {
    this.props.personActions.deletePersonRequest({ person })
  }

  render(): JSX.Element {
    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <Formik<FormProps>
            initialValues={{ name: "", surname: "" }}
            onSubmit={this.handleSubmit}
            validationSchema={PersonSchema}
          >
            {(formikProps) => (
              <AddPersonForm {...this.props} {...formikProps} />
            )}
          </Formik>
        </SafeAreaView>
      </Auth>
    )
  }
}

type AddPersonFormProps = Props & FormikProps<FormProps>

class AddPersonForm extends React.Component<AddPersonFormProps> {
  render(): JSX.Element {
    const {
      values,
      handleBlur,
      handleChange,
      loadingCreate,
      handleSubmit,
      touched,
      errors,
      errorCreate,
    } = this.props

    return (
      <View style={styles.formContainer}>
        <View style={styles.formContainerInner}>
          <MText bold style={styles.labelStyle}>Name</MText>
          <MInput
            style={styles.inputStyle}
            value={values.name}
            onBlur={handleBlur("name")}
            onChangeText={handleChange("name")}
          />
          <MText bold style={styles.labelStyle}>Surname</MText>
          <MInput
            style={styles.inputStyle}
            value={values.surname}
            onBlur={handleBlur("surname")}
            onChangeText={handleChange("surname")}
          />
          <View style={styles.buttonContainer}>
            <MButton
              title="Add"
              loading={loadingCreate}
              onPress={handleSubmit as any}
              buttonStyle={styles.buttonButtonStyle}
              titleStyle={styles.buttonTitleStyle}
            />
          </View>
        </View>
        {errors.name && touched.name && (
          <MError textStyle={styles.errorText} text={errors.name} />
        )}
        {errors.surname && touched.surname && (
          <MError textStyle={styles.errorText} text={errors.surname} />
        )}
        <View style={styles.errorInfo}>
          {errorCreate.length > 0 && (
            <MError textStyle={styles.errorText} text={errorCreate} />
          )}
        </View>
      </View>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
  const {
    loadingCreate,
    errorCreate,
  } = state.person

  return {
    loadingCreate,
    errorCreate,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    personActions: bindActionCreators(PersonActions, dispatch),
  }
}

export default withNavigation(connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PersonSettingsAdd))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "stretch",
  },
  formContainer: {},
  formContainerInner: {
  },
  errorInfo: {},
  errorText: {
    fontSize: fontSizeSmall,
  },
  personInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {},
  buttonButtonStyle: {
    width: 100,
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  labelStyle: {
    height: 20,
    marginBottom: 8,
    textAlignVertical: "center",
  },
  inputStyle: {
    fontSize: fontSizeSmall,
    textAlignVertical: "top",
    height: 20,
    width: 200,
    marginBottom: 16,
  },
  buttonTitleStyle: {
    paddingVertical: 12,
    fontSize: fontSizeSmall,
  },
  personDisplayContainer: {
    marginBottom: 8,
  },
  personDisplayContainerInner: {
    marginBottom: 24,
  },
  createNewTitle: {
    marginBottom: 8,
  },
})
