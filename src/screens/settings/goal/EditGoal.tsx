import * as React from "react"
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ViewProps,
  Alert,
} from "react-native"
import { NavigationInjectedProps } from "react-navigation"
import { Goal } from "memoneo-common/lib/types"
import MText from "../../../components/common/MText"
import { Icon } from "react-native-elements"
import { AddEntryDate } from "../../../types/AddEntry"
import {
  contentDiffColor,
  borderRadius,
  RATING_5_COLOR,
  contentColor,
  focusedColor,
} from "../../../lib/colors"
import { GoalActions } from "../../../redux/goal"
import MInput from "../../../components/common/MInput"
import { Formik, FormikProps } from "formik"
import { Yup } from "../../../lib/reexports"
import { TouchableOpacity } from "react-native-gesture-handler"

export interface EditGoalProps extends NavigationInjectedProps {
  goal: Goal
  goalActions: typeof GoalActions
  subgoalMap: { [key: string]: Goal[] }
  drag?: () => void
  isDragging?: boolean
  isDraggingSelf?: boolean
}

interface State {}

interface FormProps {
  name: string
  description?: string
}

export interface FormValues {
  name: string
  description: string
}

const EditGoalSchema = Yup.object().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
})

class EditGoal extends React.Component<EditGoalProps, State> {
  deleteGoal = () => {
    const { goalActions, goal, subgoalMap } = this.props

    if (subgoalMap.hasOwnProperty(goal.id)) {
      Alert.alert(
        "Goal still has subgoals",
        `${goal.name} still has subgoals. Please delete them first.`,
        [{ text: "OK" }]
      )
      return
    }

    const deleteActionName = goal.deleted ? "hard deleting" : "deleting"
    Alert.alert(
      "Delete Goal",
      `Please confirm ${deleteActionName} goal "${goal.name}".`,
      [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => {
            goalActions.deleteGoalRequest({ goal })
          },
        },
      ]
    )
  }

  recoverGoal = () => {
    const { goal, goalActions } = this.props

    goalActions.updateGoalRequest({ goal, recover: true })
  }

  handleSubmit = (values: FormProps) => {}

  render(): JSX.Element {
    const { goal, isDragging, drag } = this.props

    const containerStyles: any[] = [styles.goalContainer]
    if (goal.parent) {
      containerStyles.push(styles.goalContainerParent)
    }
    if (goal.deleted) {
      containerStyles.push(styles.goalContainerDeleted)
    }
    if (isDragging) {
      containerStyles.push(styles.goalContainerDragging)
    }

    const isDraggable = !!drag

    const element = (
      <View style={StyleSheet.flatten(containerStyles)} key={`goal-${goal.id}`}>
        <Formik<FormValues>
          initialValues={{
            name: goal.name,
            description: goal.description,
          }}
          onSubmit={() => {}}
          validationSchema={EditGoalSchema}
        >
          {(formikProps) => (
            <EditGoalInner
              {...this.props}
              {...formikProps}
              recoverGoal={this.recoverGoal}
              deleteGoal={this.deleteGoal}
            />
          )}
        </Formik>
      </View>
    )

    return isDraggable ? (
      <View>
        <TouchableOpacity onLongPress={drag}>{element}</TouchableOpacity>
      </View>
    ) : (
      <View>{element}</View>
    )
  }
}

interface EditGoalInnerProps extends EditGoalProps {
  deleteGoal: () => void
  recoverGoal: () => void
}

export interface EditGoalInnerSubProps extends EditGoalInnerProps {
  submit: (toUpdate: Partial<Goal>) => void
}

function EditGoalInner(
  props: EditGoalInnerProps & FormikProps<FormValues>
): JSX.Element {
  function submit(toUpdate: Partial<Goal>) {
    const newGoal = { ...props.goal, ...toUpdate }

    props.goalActions.updateGoalRequest({ goal: newGoal })
  }

  const { values, goal, handleChange } = props

  return (
    <>
      <MText bold>Name</MText>
      <MInput
        style={styles.topicHeaderText}
        key={`goal-name-${goal.id}`}
        value={values.name}
        onEndEditing={() => submit({ name: values.name })}
        onChangeText={handleChange("name")}
      />
      <MText bold>Description</MText>
      <MInput
        style={styles.topicHeaderText}
        key={`goal-desc-${goal.id}`}
        multiline
        numberOfLines={2}
        value={values.description}
        onEndEditing={() => submit({ name: values.name })}
        onChangeText={handleChange("description")}
      />
      <View style={styles.iconContainer}>
        {goal.deleted && (
          <Icon
            name="undo"
            type="evil"
            reverse
            size={8}
            onPress={() => props.recoverGoal()}
          />
        )}
        <Icon
          name="trash-2"
          type="feather"
          reverse
          size={8}
          onPress={() => props.deleteGoal()}
        />
        <Icon
          name="plus"
          type="feather"
          size={8}
          color={focusedColor}
          reverse
          containerStyle={styles.plusIcon}
          onPress={() =>
            props.navigation.navigate("AddGoal", { parentGoal: goal })
          }
        />
      </View>
    </>
  )
}

export default EditGoal

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
  plusIcon: {
    marginLeft: 0,
  },
  goalContainer: {
    padding: 10,
    backgroundColor: contentDiffColor,
    borderRadius: borderRadius,
    marginVertical: 8,
    justifyContent: "center",
    position: "relative",
  },
  goalContainerDeleted: {
    backgroundColor: RATING_5_COLOR,
  },
  goalContainerParent: {
    backgroundColor: contentColor,
    borderWidth: 2,
    borderColor: contentDiffColor,
  },
  goalContainerDragging: {},
  topicHeaderText: {
    flex: 1,
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
  addSubgoalButton: {
    height: 24,
    paddingVertical: 8,
    paddingHorizontal: 0,
    width: 100,
  },
  addSubgoalTitle: {
    fontSize: 10,
  },
})
