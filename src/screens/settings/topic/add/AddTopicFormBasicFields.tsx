import React from "react"
import { AddTopicInnerSubProps } from "./AddTopic"
import { FormikProps } from "formik"
import MText from "../../../../components/common/MText"
import MInput from "../../../../components/common/MInput"
import MError from "../../../../components/common/MError"
import { Switch, StyleSheet } from "react-native"

export default function AddTopicFormBasicFields(
  props: AddTopicInnerSubProps &
    FormikProps<{ name: string; optional: boolean }>
): JSX.Element {
  const {
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    errors,
    touched,
    errorCreate,
  } = props

  return (
    <>
      <MText bold>Question</MText>
      <MInput
        style={styles.topicHeaderText}
        multiline
        numberOfLines={2}
        value={values.name}
        onBlur={handleBlur("name")}
        onChangeText={handleChange("name")}
      />
      {errors.name && touched.name && <MError text={errors.name} />}
      <MText bold>Optional</MText>
      <Switch
        value={values.optional}
        onValueChange={() => {
          setFieldValue("optional", !values.optional)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  topicHeaderText: {
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
    flexWrap: "wrap",
  },
})
