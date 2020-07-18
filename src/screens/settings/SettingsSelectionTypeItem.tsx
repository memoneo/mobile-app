import React from "react"
import { View, StyleSheet, Keyboard, EmitterSubscription } from "react-native"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { ScrollView, SafeAreaView } from "react-navigation"
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
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import Auth from "../../components/Auth"
import MBadge from "../../components/common/MBadge"
import { sortByDisplayName } from "../../lib/sort"

interface OwnProps {}

interface StateProps {
  selectionTypeMap: SelectionTypeMap
  loadingAddItem: boolean
  loadingRemoveItem: boolean
  errorAddItem: string
  errorRemoveItem: string
}

interface DispatchProps {
  selectionTypeActions: typeof SelectionTypeActions
}

type Props = OwnProps & StateProps & DispatchProps & NavigationInjectedProps

interface SelectionTypeItemFormProps {
  name: string
}

const SelectionTypeItemSchema = Yup.object().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
})

interface State {
  showItems: boolean
}

class SelectionTypeItemSettings extends React.PureComponent<Props, State> {
  formikRef = React.createRef()
  keyboardListener: EmitterSubscription
  isMounted = false

  state = { showItems: true }

  constructor(props: Props) {
    super(props)

    this.formikRef = React.createRef()
  }

  componentWillUnmount() {
    if (this.isMounted) {
      this.keyboardListener.remove()
      this.keyboardListener.remove()
    }
  }

  private keyboardDidShow = () => this.setState({ showItems: false })

  private keyboardDidHide = () => this.setState({ showItems: true })

  componentDidMount() {
    const id: string = this.props.navigation.getParam("id")

    this.props.selectionTypeActions.getSelectionTypeRequest({
      selectionTypeId: id,
    })

    this.isMounted = true

    this.keyboardListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    )
    this.keyboardListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    )
  }

  handleSubmit = (values: SelectionTypeItemFormProps, { resetForm }) => {
    const selectionType = this.getSelectionType()
    if (!selectionType) {
      console.error(
        `Unable to find selectionType with id ${this.getSelectionTypeId()}`
      )
      return
    }

    this.props.selectionTypeActions.addItemToSelectionTypeRequest({
      selectionType: this.getSelectionType(),
      name: values.name,
    })
  }

  deleteSelectionType = (selectionType: SelectionType) => {}

  getSelectionTypeId = (): string => this.props.navigation.getParam("id")

  getSelectionType(): SelectionType | undefined {
    const id: string = this.getSelectionTypeId()

    return this.props.selectionTypeMap[id]
  }

  render(): JSX.Element {
    const selectionType = this.getSelectionType()

    const { showItems } = this.state

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          {!selectionType && (
            <View>
              <MError text="Selection Type was not found. This is an error." />
            </View>
          )}
          {selectionType && (
            <View style={styles.personDisplayContainer}>
              <View style={styles.headerText}>
                <MText
                  h1
                  bold
                  includeFontPadding={false}
                  style={styles.headerTextH1}>
                  {selectionType.displayName}
                </MText>
                <MBadge value="Selection Type" />
              </View>
              {showItems && selectionType.items.length === 0 && (
                <View>
                  <MText>
                    Add items for this Selection Type. Right now there are none.
                  </MText>
                </View>
              )}
              {showItems && (
                <ScrollView style={styles.selectionTypeItemsContainer}>
                  {selectionType.items
                    .sort(sortByDisplayName)
                    .map(selectionTypeItem => (
                      <View
                        key={`selectionType-view-${selectionTypeItem.id}`}
                        style={styles.selectionTypeContainer}>
                        <MText style={styles.selectionTypeItemText}>
                          {selectionTypeItem.displayName}
                        </MText>
                        <Icon
                          name="trash-2"
                          type="feather"
                          size={8}
                          reverse
                          iconStyle={styles.selectionTypeItemIcon}
                          containerStyle={styles.selectionTypeItemIconContainer}
                        />
                      </View>
                    ))}
                </ScrollView>
              )}
              <MText h4 style={styles.createNewTitle}>
                Create new Selection Type
              </MText>
              <Formik<SelectionTypeItemFormProps>
                initialValues={{ name: "" }}
                onSubmit={this.handleSubmit}
                validationSchema={SelectionTypeItemSchema}>
                {formikProps => (
                  <SelectionTypeItemForm {...this.props} {...formikProps} />
                )}
              </Formik>
            </View>
          )}
        </SafeAreaView>
      </Auth>
    )
  }
}

class SelectionTypeItemForm extends React.Component<
  Props & FormikProps<SelectionTypeItemFormProps>
> {
  componentDidUpdate(oldProps: Props) {
    if (
      oldProps.loadingAddItem &&
      !this.props.loadingAddItem &&
      !this.props.errorAddItem
    ) {
      this.props.resetForm()
    }
  }

  render(): JSX.Element {
    const {
      values,
      handleBlur,
      handleChange,
      loadingAddItem,
      handleSubmit,
      touched,
      errors,
      errorAddItem,
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
              loading={loadingAddItem}
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
          {errorAddItem.length > 0 && (
            <MError textStyle={styles.errorText} text={errorAddItem} />
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
    loadingAddItem,
    errorAddItem,
    loadingRemoveItem,
    errorRemoveItem,
    selectionTypeMap,
  } = state.selectionType

  return {
    loadingAddItem,
    errorAddItem,
    loadingRemoveItem,
    errorRemoveItem,
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
)(withNavigation(SelectionTypeItemSettings))

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
  selectionTypeItemsContainer: {
    marginBottom: 24,
    maxHeight: "70%",
  },
  selectionTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  createNewTitle: {
    marginBottom: 8,
  },
  selectionTypeItemText: {
    margin: 0,
    padding: 0,
  },
  selectionTypeItemIcon: {},
  selectionTypeItemIconContainer: {
    // Didn't find a better solution for this.
    marginVertical: -5,
  },
  headerTextH1: {
    marginRight: 8,
  },
  headerText: {
    flexDirection: "row",
    alignContent: "flex-end",
    alignItems: "center",
  },
})
