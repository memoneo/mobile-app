import * as React from "react"
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import {
  Topic,
  TopicLogDateType,
  TopicLog,
  TopicLogValue,
  TopicLogValueTextFiveRated,
} from "memoneo-common/lib/types"
import { styles as textStyles } from "./AddEntryTopicValueTextSimple"
import MInput from "../../../components/common/MInput"
import { Icon } from "react-native-elements"
import { AddEntryTopicValueInnerProps } from "./AddEntryTopicValue"
import { RatedType } from "../../../types/AddEntry"
import {
  getColorForRating,
  RATING_2_COLOR,
  RATING_1_COLOR,
  RATING_3_COLOR,
  RATING_4_COLOR,
  RATING_5_COLOR,
} from "../../../lib/colors"

interface Props extends AddEntryTopicValueInnerProps {
  value: TopicLogValueTextFiveRated
  ratedType: RatedType
  setTopicContainerStyles: (style: StyleProp<ViewStyle>[]) => void
}

interface State {
  text: string
  rating: number
}

class AddEntryTopicValueTextRated extends React.Component<Props, State> {
  state = {
    text: "",
    rating: -1,
  }

  componentDidMount() {
    this.updateStateAfterValueUpdate()
  }

  /**
   * Update the state when a new value prop has been passed through the request of the values for a
   * This request may for example be triggered by selecting a new day.
   *
   * @param prevProps
   */
  componentDidUpdate(prevProps: Props) {
    if (prevProps && prevProps.value !== this.props.value) {
      this.updateStateAfterValueUpdate()
    }
  }

  updateStateAfterValueUpdate = () => {
    const text = this.getDefaultTextValue()
    const rating = this.props.value ? this.props.value.rating : -1

    this.setState({ text, rating }, this.updateTopicContainerStyle)
  }

  getDefaultTextValue = () => (this.props.value ? this.props.value.text : "")

  handleRatingButtonPress = (newRating: number) => {
    this.props.saveValue({ text: this.state.text, rating: newRating })
    this.setState({ rating: newRating }, this.updateTopicContainerStyle)
  }

  updateTopicContainerStyle = () => {
    const color = getColorForRating(this.state.rating, this.props.ratedType)

    const styles: StyleProp<ViewStyle>[] = []
    if (color) {
      styles.push({ backgroundColor: color })
    }

    this.props.setTopicContainerStyles(styles)
  }

  handleEndEditing = () =>
    this.props.saveValue({ text: this.state.text, rating: this.state.rating })

  render(): JSX.Element {
    const { ratedType } = this.props
    const defaultText = this.getDefaultTextValue()
    const { text } = this.state

    return (
      <View>
        <MInput
          style={textStyles.textInput}
          multiline
          defaultValue={defaultText}
          value={text}
          numberOfLines={4}
          onChangeText={(newText: string) => this.setState({ text: newText })}
          onEndEditing={this.handleEndEditing}
        />
        {ratedType === "5rated" && (
          <RatedTypeFiveRated
            {...this.props}
            rating={this.state.rating}
            onPress={this.handleRatingButtonPress}
          />
        )}
      </View>
    )
  }
}

interface RatedProps extends Props {
  onPress: (rating: number) => void
  rating: number
}

const RatedTypeFiveRated: React.FC<RatedProps> = props => {
  const { onPress } = props

  return (
    <View style={styles.ratingOuterContainer}>
      <View style={styles.ratingContainer}>
        <Icon
          name="heart"
          type="feather"
          reverse
          size={12}
          color={RATING_1_COLOR}
          onPress={() => onPress(0)}
        />
        <Icon
          name="heart"
          type="feather"
          reverse
          size={12}
          color={RATING_2_COLOR}
          onPress={() => onPress(1)}
        />
        <Icon
          name="heart"
          type="feather"
          reverse
          size={12}
          color={RATING_3_COLOR}
          onPress={() => onPress(2)}
        />
        <Icon
          name="heart"
          type="feather"
          reverse
          size={12}
          color={RATING_4_COLOR}
          onPress={() => onPress(3)}
        />
        <Icon
          name="heart"
          type="feather"
          reverse
          size={12}
          color={RATING_5_COLOR}
          onPress={() => onPress(4)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ratingOuterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
})

export default AddEntryTopicValueTextRated
