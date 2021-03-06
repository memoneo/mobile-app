import React from "react"
import { View, StyleSheet } from "react-native"
import { NavigationInjectedProps, SafeAreaView, withNavigation } from "react-navigation"
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../redux"
import { PersonActions } from "../../redux/person"
import { Person } from "memoneo-common/lib/types"
import { Yup } from "../../lib/reexports"
import MText from "../../components/common/MText"
import { fontSizeSmall } from "../../lib/styleVars"
import { Icon } from "react-native-elements"
import { formatPersonName } from "../../lib/format"
import Section from "../../components/Section"
import SectionTitle from "../../components/SectionTitle"
import Auth from "../../components/Auth"
import { focusedColor } from "../../lib/colors"

interface OwnProps {}

interface StateProps {
  loadingGetDelete: boolean
  errorGetDelete: string
  persons: Person[]
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

class PersonSettings extends React.PureComponent<Props, State> {
  formikRef = React.createRef()

  constructor(props: Props) {
    super(props)

    this.formikRef = React.createRef()
  }

  componentDidMount() {
    this.props.personActions.getPersonsRequest()
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
    const { persons } = this.props

    return (
      <Auth>
        <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
            <SectionTitle title="Persons" />
            <Icon
              name="plus"
              type="feather"
              size={12}
              color={focusedColor}
              reverse
              onPress={() =>
                this.props.navigation.navigate("PersonAdd")
              }
            />
          </View>
          <Section>
            {persons.length === 0 && (
              <View>
                <MText>
                  Configure Persons for use in the respective Memoneo entries
                  regarding Persons. Right now there are none..
                </MText>
              </View>
            )}
            <View style={styles.personDisplayContainerInner}>
              {persons.map((person) => (
                <View
                  key={`person-view-${person.id}`}
                  style={styles.personInfoContainer}
                >
                  <MText>{formatPersonName(person)}</MText>
                  <Icon name="trash-2" type="feather" size={8} reverse />
                </View>
              ))}
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
  const { loadingGetDelete, errorGetDelete, persons } = state.person

  return {
    persons,
    loadingGetDelete,
    errorGetDelete,
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
)(PersonSettings))

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
  personInfoContainer: {
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
  personDisplayContainerInner: {
    marginBottom: 24,
  },
  createNewTitle: {
    marginBottom: 8,
  },
})
