import * as React from "react"
import { StyleSheet } from "react-native"
import { EditGoalInnerSubProps } from "./EditGoal"
import { Icon } from "react-native-elements"

interface Props extends EditGoalInnerSubProps {}

function EditGoalTrashIcon(props: Props): JSX.Element {
  const { goal, isDragging, isDraggingSelf } = props

  return (
    <>
      {!goal.deleted && !isDragging && !isDraggingSelf && (
        <Icon
          containerStyle={styles.trashIcon}
          name="trash-2"
          type="feather"
          reverse
          size={8}
          onPress={() => props.deleteGoal()}
        />
      )}
    </>
  )
}

export const styles = StyleSheet.create({
  trashIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
})

export default EditGoalTrashIcon
