import * as React from "react"
import { StyleSheet, View } from "react-native"
import { TopicLogValueTextSimple } from "memoneo-common/lib/types"
import { FormikProps, Formik } from "formik"
import { EditTopicInnerSubProps } from "./EditTopic"
import { Yup } from "../../../lib/reexports"
import MText from "../../../components/common/MText"
import MInput from "../../../components/common/MInput"
import { formatTopicTypeName } from "../../../lib/format"
import { Switch, TouchableHighlight } from "react-native-gesture-handler"
import { Icon } from "react-native-elements"

interface FormValues {
  name: string
  optional: boolean
}

type Props = EditTopicInnerSubProps &
  FormikProps<{ name: string; optional: boolean }>

interface FormProps extends FormikProps<FormValues> {
  value?: TopicLogValueTextSimple
}

function EditTopicBasic(props: Props): JSX.Element {
  const topic = props.topic

  const {
    values,
    handleChange,
    setFieldValue,
    isDraggingSelf,
    isDragging,
  } = props

  return false ? (
    <Icon name="drag-handle" type="material" />
  ) : (
    <>
      <ItemRow>
        <MText bold>Question</MText>
        <MInput
          style={styles.topicHeaderText}
          key={`topic-text-${topic.id}`}
          multiline
          numberOfLines={2}
          value={values.name}
          onEndEditing={() => props.submit({ name: values.name })}
          onChangeText={handleChange("name")}
        />
      </ItemRow>
      <ItemRow>
        <MText bold>Type</MText>
        <MText>{formatTopicTypeName(topic.typeInfo.type)}</MText>
      </ItemRow>
      <ItemRow>
        <MText bold>Optional</MText>
        <Switch
          value={values.optional}
          onValueChange={() => {
            setFieldValue("optional", !values.optional)
            props.submit({ optional: !values.optional })
          }}
        />
      </ItemRow>
      <View style={styles.iconContainer}>
        {topic.deleted && (
          <Icon
            name="undo"
            type="evil"
            reverse
            size={8}
            onPress={() => props.deleteTopic()}
          />
        )}
        <Icon
          containerStyle={styles.trashIcon}
          name="trash-2"
          type="feather"
          reverse
          size={8}
          onPress={() => props.deleteTopic()}
        />
      </View>
    </>
  )
}

function ItemRow(props: React.PropsWithChildren<{}>): JSX.Element {
  return <View style={styles.itemRow}>{props.children}</View>
}

export const styles = StyleSheet.create({
  itemRow: {
    marginBottom: 8,
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
  trashIcon: {
    marginLeft: 0,
  },
  textInput: {
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
  },
  topicHeaderText: {
    flex: 1,
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
})

export default EditTopicBasic
