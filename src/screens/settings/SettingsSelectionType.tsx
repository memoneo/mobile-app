import React from "react"
import { View, StyleSheet, SafeAreaView } from "react-native"
import { ScrollView } from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import { SelectionType } from "memoneo-common/lib/types"
import { Yup } from "../../lib/reexports"
import { Formik, FormikProps } from "formik"
import MText from "../../components/common/MText"
import MInput from "../../components/common/MInput"
import MError from "../../components/common/MError"
import MButton from "../../components/common/MButton"
import { fontSizeSmall } from "../../lib/styleVars"
import { Button, Icon } from "react-native-elements"
import {
  SelectionTypeActions,
  SelectionTypeMap,
} from "../../redux/selectionType"
import Auth from "../../components/Auth"
import Section from "../../components/Section"
import SectionTitle from "../../components/SectionTitle"
import { NavigationInjectedProps, withNavigation } from "react-navigation"

interface OwnProps {}

interface StateProps {
  loadingGet: boolean
  loadingAddItem: boolean
  loadingRemoveItem: boolean
  loadingCreate: boolean
  errorGet: string
  errorAddItem: string
  errorRemoveItem: string
  errorDelete: string
  errorCreate: string
  selectionTypeMap: SelectionTypeMap
}

interface DispatchProps {
  selectionTypeActions: typeof SelectionTypeActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface SelectionTypeFormProps {
  name: string
}

const SelectionTypeSchema = Yup.object().shape({
  name: Yup.string()
    .min(1)
    .max(16)
    .required("Name is required"),
})

interface State {}

class SelectionTypeSettings extends React.PureComponent<Props, State> {
  formikRef = React.createRef()

  constructor(props: Props) {
    super(props)

    this.formikRef = React.createRef()
  }

  componentDidMount() {
    this.props.selectionTypeActions.getSelectionTypesRequest()
  }

  handleSubmit = (values: SelectionTypeFormProps, { resetForm }) => {
    this.props.selectionTypeActions.createSelectionTypeRequest({
      name: values.name,
    })
  }

  deleteSelectionType = (selectionType: SelectionType) => {}

  render(): JSX.Element {
    const { selectionTypeMap } = this.props
    const selectionTypes = Object.values(selectionTypeMap)

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <SectionTitle title="Selection Types" />
          <Section>
            <View style={styles.personDisplayContainer}>
              {selectionTypes.length === 0 && (
                <View>
                  <MText>
                    Configure Selection Types for use in Memoneo entries. Right
                    now it's empty.
                  </MText>
                </View>
              )}
              <ScrollView style={styles.personDisplayContainerInner}>
                {selectionTypes.map(selectionType => (
                  <View
                    key={`selectionType-view-${selectionType.id}`}
                    style={styles.selectionTypeContainer}>
                    <MText>{selectionType.displayName}</MText>
                    <View style={styles.selectionTypeContainerInner}>
                      <Icon name="trash-2" type="feather" size={8} reverse />
                      <MButton
                        title="Edit"
                        titleStyle={styles.buttonTitleStyle}
                        buttonStyle={styles.buttonButtonStyle}
                        onPress={() =>
                          this.props.navigation.navigate("SelectionTypeItem", {
                            id: selectionType.id,
                          })
                        }
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <MText h4 style={styles.createNewTitle}>
              Create new Selection Type
            </MText>
            <Formik<SelectionTypeFormProps>
              initialValues={{ name: "" }}
              onSubmit={this.handleSubmit}
              validationSchema={SelectionTypeSchema}>
              {formikProps => (
                <SelectionTypeForm {...this.props} {...formikProps} />
              )}
            </Formik>
          </Section>
        </SafeAreaView>
      </Auth>
    )
  }
}

class SelectionTypeForm extends React.Component<
  Props & FormikProps<SelectionTypeFormProps>
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
          <MText style={styles.labelStyle}>Name</MText>
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

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const {
    loadingGet,
    errorGet,
    loadingAddItem,
    errorAddItem,
    loadingRemoveItem,
    errorRemoveItem,
    loadingCreate,
    errorCreate,
    selectionTypeMap,
  } = state.selectionType

  return {
    loadingGet,
    errorGet,
    errorDelete: "",
    loadingAddItem,
    errorAddItem,
    loadingRemoveItem,
    errorRemoveItem,
    loadingCreate,
    errorCreate,
    selectionTypeMap,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    selectionTypeActions: bindActionCreators(SelectionTypeActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(SelectionTypeSettings))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "stretch",
  },
  formContainer: {},
  formContainerInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorInfo: {},
  errorText: {
    fontSize: fontSizeSmall,
  },
  selectionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectionTypeContainerInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {},
  buttonButtonStyle: {
    height: 20,
    width: 50,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  labelStyle: {
    fontSize: fontSizeSmall,
    height: 20,
    marginRight: 8,
    textAlignVertical: "center",
  },
  inputStyle: {
    fontSize: fontSizeSmall,
    textAlignVertical: "top",
    height: 20,
    width: 80,
    marginRight: 16,
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
