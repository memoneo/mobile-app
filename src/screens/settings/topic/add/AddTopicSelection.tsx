import * as React from "react"
import { StyleSheet, Switch, Picker } from "react-native"
import { Formik } from "formik"
import { Yup } from "../../../../lib/reexports"
import MText from "../../../../components/common/MText"
import MInput from "../../../../components/common/MInput"
import MPicker from "../../../../components/common/MPicker"
import { AddTopicInnerSubProps } from "./AddTopic"
import {
  TopicTypeInfo,
  TopicType,
  SelectionType,
  Topic,
  TopicTypeInfoSelectionData,
} from "memoneo-common/lib/types"
import MError from "../../../../components/common/MError"
import AddTopicFormBasicFields from "./AddTopicFormBasicFields"

interface FormValues {
  name: string
  optional: boolean
  selectionTypeId: string
}

interface Props extends AddTopicInnerSubProps {
  typeName: TopicType
  selectionTypes: SelectionType[]
}

const AddTopicSelectionSchema = Yup.object().shape({
  name: Yup.string()
    .min(1)
    .max(64)
    .required("Name is required"),
  optional: Yup.boolean(),
  selectionTypeId: Yup.string().required(),
})

function AddTopicSelection(props: Props): JSX.Element {
  function handleSubmit(values: FormValues) {
    const typeInfo: TopicTypeInfoSelectionData = {
      type: "selection",
      selectionTypeId: values.selectionTypeId,
    }

    const topic: Topic = {
      id: "",
      name: values.name,
      description: "",
      optional: values.optional,
      deleted: false,
      typeInfo,
    }

    props.submit(topic)
  }

  const { errorCreate } = props

  return (
    <Formik<FormValues>
      initialValues={{
        name: "",
        optional: false,
        selectionTypeId: "",
      }}
      onSubmit={handleSubmit}
      validationSchema={AddTopicSelectionSchema}>
      {formikProps => {
        const { values, handleChange } = formikProps

        return (
          <>
            <AddTopicFormBasicFields {...props} {...formikProps} />
            <MText bold>Selection Type</MText>
            {props.selectionTypes.length === 0 && (
              <MError text="No Selection Types found" />
            )}
            {props.selectionTypes.length > 0 && (
              <MPicker
                selectedValue={values.selectionTypeId}
                onValueChange={handleChange("selectionTypeId")}>
                {props.selectionTypes.map(selectionType => (
                  <Picker.Item
                    key={selectionType.id}
                    label={selectionType.displayName}
                    value={selectionType.id}
                  />
                ))}
              </MPicker>
            )}
            {errorCreate.length > 0 && <MError text={errorCreate} />}
          </>
        )
      }}
    </Formik>
  )
}

export const styles = StyleSheet.create({
  textInput: {
    textAlignVertical: "top",
    backgroundColor: "#efefef",
    fontSize: 11,
  },

  trashIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
})

export default AddTopicSelection
