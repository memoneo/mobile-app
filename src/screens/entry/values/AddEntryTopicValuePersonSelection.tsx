import * as React from "react"
import { View, StyleSheet } from "react-native"
import {
  SelectionTypeItem,
  TopicLogValuePersonSelection,
  Person,
} from "memoneo-common/lib/types"
import MButton from "../../../components/common/MButton"
import { AddEntryTopicValueInnerProps } from "./AddEntryTopicValue"
import { formatPersonName } from "../../../lib/format"

interface Props extends AddEntryTopicValueInnerProps {
  value?: TopicLogValuePersonSelection
  persons: Person[]
}

interface State {
  selectedPersons: Person[]
}

class AddEntryTopicValuePersonSelection extends React.Component<Props, State> {
  state = { selectedPersons: [] }

  updateSelectedItemsFromValue = () => {
    let selectablePersons = this.props.persons

    const savedSelectedPersons = []
    if (this.props.value) {
      this.props.value.personSelection.forEach(selectedPersonId => {
        const existingIdx = selectablePersons.findIndex(
          selectablePerson => selectablePerson.id === selectedPersonId
        )
        if (existingIdx !== -1) {
          savedSelectedPersons.push(selectablePersons[existingIdx])
        }
      })
    }

    this.setState({ selectedPersons: savedSelectedPersons })
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

  render(): JSX.Element {
    let { selectedPersons } = this.state

    let selectablePersons = this.props.persons

    return (
      <View style={styles.selectableContainer}>
        {selectablePersons.map(person => {
          const currentIndex = selectedPersons.findIndex(
            selectedPerson => person.id === selectedPerson.id
          )

          const buttonType = currentIndex === -1 ? "outline" : "solid"

          const onPressButton = () => {
            const newSelectedPersons = [...selectedPersons]
            if (currentIndex !== -1) {
              newSelectedPersons.splice(currentIndex, 1)
            } else {
              newSelectedPersons.push(person)
            }

            this.setState({ selectedPersons: newSelectedPersons })
            this.props.saveValue({
              personSelection: newSelectedPersons.map(person => person.id),
            })
          }

          return (
            <MButton
              type={buttonType}
              title={formatPersonName(person)}
              key={person.id}
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

export default AddEntryTopicValuePersonSelection
