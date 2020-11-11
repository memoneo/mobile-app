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
import { focusedColor } from "../../lib/colors"

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

  deleteSelectionType = (selectionType: SelectionType) => {}

  render(): JSX.Element {
    const { selectionTypeMap } = this.props
    const selectionTypes = Object.values(selectionTypeMap)

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
            <SectionTitle title="Selection Types" />
            <Icon
              name="plus"
              type="feather"
              size={12}
              color={focusedColor}
              reverse
              onPress={() => this.props.navigation.navigate("SelectionTypeItemAdd")}
            />
          </View>
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
                {selectionTypes.map((selectionType) => (
                  <View
                    key={`selectionType-view-${selectionType.id}`}
                    style={styles.selectionTypeContainer}
                  >
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
          </Section>
        </SafeAreaView>
      </Auth>
    )
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState> = (
  state
) => {
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
)(withNavigation(SelectionTypeSettings))

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
