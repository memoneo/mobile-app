import React from "react"
import { View, StyleSheet } from "react-native"
import { connect, MapDispatchToProps, MapStateToProps } from "react-redux"
import { SafeAreaView } from "react-navigation"
import { Yup } from "../../lib/reexports"
import { Formik, FormikProps } from "formik"
import MText from "../../components/common/MText"
import MInput from "../../components/common/MInput"
import MError from "../../components/common/MError"
import MButton from "../../components/common/MButton"
import { SelectionTypeActions } from "../../redux/selectionType"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import Auth from "../../components/Auth"
import { RootState } from "../../redux"
import { bindActionCreators } from "redux"
import { fontSizeSmall } from "../../lib/styleVars"
import { borderRadius, secondaryColor, thirdColor } from "../../lib/colors"

interface OwnProps {}

interface StateProps {
  loadingCreate: boolean
  errorCreate: string
}

interface DispatchProps {
  selectionTypeActions: typeof SelectionTypeActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

const SelectionTypeSchema = Yup.object().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
})

interface FormValues {
  name: string
}

interface State {
  showItems: boolean
}

class SelectionTypeItemAddSettings extends React.PureComponent<Props, State> {
  handleSubmit = (values: FormValues, { resetForm }) => {
    this.props.selectionTypeActions.createSelectionTypeRequest({
      name: values.name,
    })
  }

  componentDidUpdate(oldProps: Props) {
    if (oldProps.loadingCreate && !this.props.loadingCreate) {
      if (!this.props.errorCreate) {
        this.props.navigation.navigate("SelectionType")
      }
    }
  }

  render(): JSX.Element {
    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <Formik<FormValues>
            initialValues={{ name: "" }}
            onSubmit={this.handleSubmit}
            validationSchema={SelectionTypeSchema}
          >
            {(formikProps) => (
              <SelectionTypeForm {...this.props} {...formikProps} />
            )}
          </Formik>
        </SafeAreaView>
      </Auth>
    )
  }
}

class SelectionTypeForm extends React.Component<
  Props & FormikProps<FormValues>
> {
  componentDidUpdate(oldProps: Props) {
    if (
      oldProps.loadingCreate &&
      !this.props.loadingCreate &&
      !this.props.errorCreate
    ) {
      this.props.resetForm()
    }
  }

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
  const { loadingCreate, errorCreate } = state.selectionType

  return {
    loadingCreate,
    errorCreate,
  }
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (
  dispatch
) => {
  return {
    selectionTypeActions: bindActionCreators(SelectionTypeActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(SelectionTypeItemAddSettings))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "stretch",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formContainer: {},
  formContainerInner: {
  },
  errorInfo: {},
  errorText: {
    fontSize: fontSizeSmall,
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
  },
  createNewTitle: {
    marginBottom: 16,
    backgroundColor: thirdColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius,
  },
})
