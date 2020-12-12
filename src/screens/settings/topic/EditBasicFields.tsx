import * as React from "react"
import { StyleSheet, View } from "react-native"
import { FormikProps } from "formik"
import { EditTopicInnerSubProps } from "./EditTopic"
import { Yup } from "../../../lib/reexports"
import MText from "../../../components/common/MText"
import MInput from "../../../components/common/MInput"
import { formatTopicTypeName } from "../../../lib/format"
import { Switch, TouchableHighlight } from "react-native-gesture-handler"
import { Icon } from "react-native-elements"
import { Topic, TopicType, TopicTypeInfo } from "memoneo-common/lib/types"
import MPicker from "../../../components/common/MPicker"
import { Picker } from "@react-native-community/picker"
import MButton from "../../../components/common/MButton"

export interface BasicFormValues {
  name: string
  optional: boolean
  hasVoice: boolean
}

export const BasicEditSchema = Yup.object().shape({
  name: Yup.string().min(1).max(222).required("Name is required"),
  optional: Yup.boolean(),
  hasVoice: Yup.boolean(),
})

export function getBasicInitialValues(topic?: Topic): BasicFormValues {
  return {
    name: topic?.name ?? "",
    optional: topic?.optional ?? false,
    hasVoice: topic?.hasVoice ?? false,
  }
}

type Props = EditTopicInnerSubProps & FormikProps<BasicFormValues>

function EditBasicFields(props: Props): JSX.Element {
  const topic = props.topic

  const { mode, values, handleChange, setFieldValue, changeType } = props

  return (
    <>
      <ItemRow>
        <MText bold>Question</MText>
        <MInput
          style={styles.topicHeaderText}
          key={`topic-text-${topic?.id ?? "add"}`}
          multiline
          numberOfLines={2}
          value={values.name}
          onEndEditing={() => {
            if (mode === "edit") {
              if (values.name.length > 1) {
                props.submitUpdate({ name: values.name })
              }
            }
          }}
          onChangeText={handleChange("name")}
        />
      </ItemRow>
      <ItemRow>
        <MText bold>Type</MText>
        {mode === "add" && (
          <MPicker
            selectedValue={props.type}
            onValueChange={(value: TopicType) => {
              changeType(value)
            }}>
            <Picker.Item label="Text Simple" value="text-simple" />
            <Picker.Item label="Text Rated" value="text-5rated" />
            <Picker.Item label="Selection" value="selection" />
            <Picker.Item label="Person Selection" value="person-selection" />
            <Picker.Item label="Goal Selection" value="goal-selection" />
          </MPicker>
        )}
        {mode === "edit" && (
          <MText>{formatTopicTypeName(topic.typeInfo.type)}</MText>
        )}
      </ItemRow>
      <ItemRow>
        <MText bold>Optional</MText>
        <Switch
          value={values.optional}
          onValueChange={() => {
            setFieldValue("optional", !values.optional)

            if (mode === "edit") {
              props.submitUpdate({ optional: !values.optional })
            }
          }}
        />
      </ItemRow>
      <ItemRow>
        <MText bold>Voice</MText>
        <Switch
          value={values.hasVoice}
          onValueChange={() => {
            setFieldValue("hasVoice", !values.hasVoice)

            if (mode === "edit") {
              props.submitUpdate({ hasVoice: !values.hasVoice })
            }
          }}
        />
      </ItemRow>
      {mode === "edit" && (
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
      )}
    </>
  )
}

export function AddButton(props: FormikProps<{}>) {
  return (
    <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
      <MButton
        title="Add"
        onPress={() => {
          console.log("Submitting")
          props.handleSubmit()
        }}
        buttonStyle={styles.buttonStyle}
      />
    </View>
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
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
  buttonStyle: {
    width: 100,
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
})

export default EditBasicFields
