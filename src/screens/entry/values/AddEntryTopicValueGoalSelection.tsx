import * as React from "react"
import { View, StyleSheet } from "react-native"
import { TopicLogValueGoalSelection, Goal } from "memoneo-common/lib/types"
import MButton from "../../../components/common/MButton"
import { AddEntryTopicValueInnerProps } from "./AddEntryTopicValue"

interface Props extends AddEntryTopicValueInnerProps {
  value?: TopicLogValueGoalSelection
  goals: Goal[]
}

interface State {
  selectedGoals: Goal[]
}

class AddEntryTopicValueGoalSelection extends React.Component<Props, State> {
  state = { selectedGoals: [] }

  updateSelectedItemsFromValue = () => {
    let selectableGoals = this.props.goals

    const savedSelectedGoals = []
    if (this.props.value) {
      this.props.value.goalSelection.forEach((selectedGoalId) => {
        const existingIdx = selectableGoals.findIndex(
          (selectableGoal) => selectableGoal.id === selectedGoalId
        )
        if (existingIdx !== -1) {
          savedSelectedGoals.push(selectableGoals[existingIdx])
        }
      })
    }

    this.setState({ selectedGoals: savedSelectedGoals })
  }

  componentDidMount() {
    this.updateSelectedItemsFromValue()
  }

  /**
   * Update the state when a new value prop has been passed through the request of the values for a
   * This request may for example be triggered by selecting a new day.
   *
   * @param prevProps
   */
  componentDidUpdate(prevProps: Props) {
    if (prevProps && prevProps.value !== this.props.value) {
      this.updateSelectedItemsFromValue()
    }
  }

  getSelectableGoals = () => this.props.goals.filter((goal) => !goal.parent)

  render(): JSX.Element {
    let { selectedGoals } = this.state

    let selectableGoals = this.getSelectableGoals()

    return (
      <View style={styles.selectableContainer}>
        {selectableGoals.map((goal) => {
          const currentIndex = selectedGoals.findIndex(
            (selectedGoal) => goal.id === selectedGoal.id
          )

          const buttonType = currentIndex === -1 ? "outline" : "solid"

          const onPressButton = () => {
            const newSelectedGoals = [...selectedGoals]
            if (currentIndex !== -1) {
              newSelectedGoals.splice(currentIndex, 1)
            } else {
              newSelectedGoals.push(goal)
            }

            this.setState({ selectedGoals: newSelectedGoals })
            this.props.saveValue({
              goalSelection: newSelectedGoals.map((goal) => goal.id),
            })
          }

          return (
            <MButton
              type={buttonType}
              title={goal.name}
              key={goal.id}
              titleStyle={styles.selectableItemTitleStyle}
              buttonStyle={styles.selectableItemButtonStyle}
              onPress={onPressButton}
            />
          )
        })}
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  selectableContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  selectableItemTitleStyle: {
    fontSize: 10,
    padding: 0,
  },
  selectableItemButtonStyle: {
    paddingHorizontal: 8,
    height: 20,
    marginHorizontal: 4,
    borderWidth: 0.5,
    borderColor: "transparent",
  },
})

export default AddEntryTopicValueGoalSelection
