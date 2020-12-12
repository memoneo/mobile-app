import * as React from "react"
import { StyleSheet } from "react-native"
import {
  SelectionType,
  Topic,
  TopicLogValueTextSimple,
  TopicTypeInfoSelectionData,
} from "memoneo-common/lib/types"
import { FormikProps, Formik } from "formik"
import { EditTopicInnerSubProps } from "./EditTopic"
import { Yup } from "../../../lib/reexports"
import EditBasicFields, {
  AddButton,
  BasicEditSchema,
  BasicFormValues,
  getBasicInitialValues,
} from "./EditBasicFields"
import MText from "../../../components/common/MText"
import MError from "../../../components/common/MError"
import MPicker from "../../../components/common/MPicker"
import { Picker } from "@react-native-community/picker"

interface FormValues extends BasicFormValues {
  selectionTypeId: string
}

interface Props extends EditTopicInnerSubProps {
  selectionTypes: SelectionType[]
}

const EditTopicSelectionSchema = BasicEditSchema.clone().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
  optional: Yup.boolean(),
  selectionTypeId: Yup.string().required(),
})

function EditTopicSelection(props: Props): JSX.Element {
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
      hasVoice: values.hasVoice,
    }

    props.submitCreateTopic(topic)
  }

  return (
    <Formik<FormValues>
      initialValues={{
        ...getBasicInitialValues(props.topic),
        selectionTypeId:
          (props.topic?.typeInfo as TopicTypeInfoSelectionData)
            ?.selectionTypeId ?? "",
      }}
      onSubmit={handleSubmit}
      validationSchema={EditTopicSelectionSchema}>
      {formikProps => (
        <>
          <EditBasicFields {...props} {...formikProps} />
          {props.mode === "add" && (
            <React.Fragment>
              <MText bold>Selection Type</MText>
              {props.selectionTypes.length === 0 && (
                <MError text="No Selection Types found" />
              )}
              {props.selectionTypes.length > 0 && (
                <MPicker
                  selectedValue={formikProps.values.selectionTypeId}
                  onValueChange={
                    formikProps.handleChange("selectionTypeId") as any
                  }>
                  {props.selectionTypes.map(selectionType => (
                    <Picker.Item
                      key={selectionType.id}
                      label={selectionType.displayName}
                      value={selectionType.id}
                    />
                  ))}
                </MPicker>
              )}
            </React.Fragment>
          )}
          {props.mode === "add" && <AddButton {...formikProps} />}
        </>
      )}
    </Formik>
  )
}

export const styles = StyleSheet.create({})

export default EditTopicSelection
