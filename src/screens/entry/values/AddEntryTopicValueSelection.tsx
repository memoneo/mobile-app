import * as React from "react"
import { View, StyleSheet } from "react-native"
import {
  SelectionTypeItem,
  TopicLogValueSelection,
} from "memoneo-common/lib/types"
import MButton from "../../../components/common/MButton"
import { AddEntryTopicValueInnerProps } from "./AddEntryTopicValue"

interface Props extends AddEntryTopicValueInnerProps {
  value?: TopicLogValueSelection
}

interface State {
  selectedItems: SelectionTypeItem[]
}

class AddEntryTopicValueSelection extends React.Component<Props, State> {
  state = { selectedItems: [] }

  updateSelectedItemsFromValue = () => {
    let selectableItems = this.props.topic.typeInfo.data.items

    const savedSelectedItems = []
    if (this.props.value) {
      this.props.value.selection.forEach(selectionItemId => {
        const existingIdx = selectableItems.findIndex(
          selectableItem => selectableItem.id === selectionItemId
        )
        if (existingIdx !== -1) {
          savedSelectedItems.push(selectableItems[existingIdx])
        }
      })
    }

    this.setState({ selectedItems: savedSelectedItems })
  }

  componentDidMount() {
    if (!this.props.topic.typeInfo.data) {
      console.error("props.topic.typeInfo.data should not be falsy")
      return null
    }

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
    let { selectedItems } = this.state

    let selectableItems = this.props.topic.typeInfo.data.items

    return (
      <View style={styles.selectableContainer}>
        {selectableItems.map(item => {
          const currentIndex = selectedItems.findIndex(
            selectedItem => item.id === selectedItem.id
          )

          const buttonType = currentIndex === -1 ? "outline" : "solid"

          const onPressButton = () => {
            const newSelectedItems = [...selectedItems]
            if (currentIndex !== -1) {
              newSelectedItems.splice(currentIndex, 1)
            } else {
              newSelectedItems.push(item)
            }

            this.setState({ selectedItems: newSelectedItems })
            this.props.saveValue({
              selection: newSelectedItems.map(item => item.id),
            })
          }

          return (
            <MButton
              type={buttonType}
              title={item.displayName}
              key={item.id}
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

export default AddEntryTopicValueSelection
