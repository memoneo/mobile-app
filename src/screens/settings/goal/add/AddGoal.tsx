import * as React from "react"
import { View, StyleSheet, Picker } from "react-native"
import { Goal } from "memoneo-common/lib/types"
import { contentDiffColor, borderRadius } from "../../../../lib/colors"
import { GoalActions } from "../../../../redux/goal"
import { AddEntryDate } from "../../../../types/AddEntry"
import MPicker from "../../../../components/common/MPicker"
import { NavigationInjectedProps, withNavigation } from "react-navigation"
import { SelectionTypeActions } from "../../../../redux/selectionType"
import MText from "../../../../components/common/MText"
import { MapDispatchToProps, connect, MapStateToProps } from "react-redux"
import { bindActionCreators } from "redux"
import { RootState } from "../../../../redux"
import { Yup } from "../../../../lib/reexports"
import { Formik } from "formik"
import MButton from "../../../../components/common/MButton"
import MError from "../../../../components/common/MError"
import MInput from "../../../../components/common/MInput"

interface OwnProps {}

interface DispatchProps {
  goalActions: typeof GoalActions
}

interface StateProps {
  errorCreate: string
  loadingCreate: boolean
}

export type AddGoalProps = OwnProps &
  StateProps &
  DispatchProps &
  NavigationInjectedProps

class AddGoal extends React.Component<AddGoalProps> {
  componentDidUpdate(oldProps: AddGoalProps) {
    if (
      oldProps.loadingCreate &&
      !this.props.loadingCreate &&
      !this.props.errorCreate
    ) {
      this.props.navigation.navigate("Goal")
    }
  }

  getParentGoal = (): Goal | null => {
    return this.props.navigation.getParam("parentGoal")
  }

  render(): JSX.Element {
    const containerStyles: any[] = [addGoalStyles.goalContainer]

    const parentGoal = this.getParentGoal()

    return (
      <View style={addGoalStyles.main}>
        {!parentGoal && (
          <MText h4 bold>
            Add Goal
          </MText>
        )}
        {parentGoal && (
          <View style={addGoalStyles.parentGoalTitle}>
            <MText h4 bold>
              Add Subgoal to
            </MText>
            <MText>{parentGoal.name}</MText>
          </View>
        )}
        <View style={StyleSheet.flatten(containerStyles)}>
          <AddGoalInner {...this.props} parentGoal={parentGoal} />
        </View>
      </View>
    )
  }
}

interface FormValues {
  name: string
  description: string
}

const AddGoalSchema = Yup.object().shape({
  name: Yup.string().min(1).max(64).required("Name is required"),
  description: Yup.string(),
})

interface AddGoalInnerProps extends AddGoalProps {
  parentGoal?: Goal
}

function AddGoalInner(props: AddGoalInnerProps): JSX.Element {
  function submit(toUpdate: Partial<Goal>) {
    const newGoal = { ...toUpdate }
    if (props.parentGoal) {
      newGoal.parent = props.parentGoal.id
    }

    props.goalActions.createGoalRequest({ goal: newGoal, parent: props.parentGoal || null })
  }

  return (
    <Formik<FormValues>
      initialValues={{
        name: "",
        description: "",
      }}
      onSubmit={submit}
      validationSchema={AddGoalSchema}>
      {({
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        touched,
      }) => {
        return (
          <>
            <MText bold>Name</MText>
            <MInput
              style={addGoalStyles.topicHeaderText}
              value={values.name}
              onBlur={handleBlur("name")}
              onChangeText={handleChange("name")}
            />
            {errors.name && touched.name && <MError text={errors.name} />}
            <MText bold>Description</MText>
            <MInput
              style={addGoalStyles.topicHeaderText}
              multiline
              numberOfLines={2}
              value={values.description}
              onBlur={handleBlur("description")}
              onChangeText={handleChange("description")}
            />
            {errors.description && touched.description && (
              <MError text={errors.description} />
            )}
            {props.errorCreate.length > 0 && (
              <MError text={props.errorCreate} />
            )}
            <View style={addGoalStyles.addButtonContainer}>
              <MButton
                title="Add"
                buttonStyle={addGoalStyles.addButton}
                titleStyle={addGoalStyles.optionsButtonTitle}
                onPress={handleSubmit as any}
              />
            </View>
          </>
        )
      }}
    </Formik>
  )
}

const mapStateToProps: MapStateToProps<
  StateProps,
  OwnProps,
  RootState
> = state => {
  const loading = state.user.loading || state.goal.loading
  const loadingGoal = state.goal.loading
  const errorGoal = state.goal.error
  const errorCreate = state.goal.errorCreate
  const loadingCreate = state.goal.loadingCreate
  const selectionTypes = Object.values(state.selectionType.selectionTypeMap)

  return {
    loading,
    loadingGoal,
    errorGoal,
    errorCreate,
    selectionTypes,
    loadingCreate,
  }
}

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  OwnProps
> = dispatch => {
  return {
    goalActions: bindActionCreators(GoalActions, dispatch),
    selectionTypeActions: bindActionCreators(SelectionTypeActions, dispatch),
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(AddGoal))

export const addGoalStyles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  goalContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: contentDiffColor,
    borderRadius: borderRadius,
    marginVertical: 8,
    justifyContent: "center",
    position: "relative",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalHeaderIconBar: {
    flexDirection: "row",
  },
  goalHeaderText: {
    flex: 1,
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
  addButton: {
    height: 20,
    width: 100,
  },
  optionsButtonTitle: {
    fontSize: 11,
  },
  addButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  topicHeaderText: {
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
  parentGoalTitle: {
    marginBottom: 8
  }
})
