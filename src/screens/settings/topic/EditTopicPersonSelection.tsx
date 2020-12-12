import * as React from "react"
import { StyleSheet } from "react-native"
import { Formik } from "formik"
import { EditTopicInnerSubProps } from "./EditTopic"
import EditBasicFields, {
  AddButton,
  BasicEditSchema,
  BasicFormValues,
  getBasicInitialValues,
} from "./EditBasicFields"
import { TopicTypeInfo } from "memoneo-common/lib/types"

interface FormValues extends BasicFormValues {
}

interface Props extends EditTopicInnerSubProps {}

const EditTopicPersonSelectionSchema = BasicEditSchema.clone().shape({})

function EditTopicPersonSelection(props: Props): JSX.Element {
  return (
    <Formik<FormValues>
      initialValues={{
        ...getBasicInitialValues(props.topic),
      }}
      onSubmit={props.submitCreateTopicFromValues}
      validationSchema={EditTopicPersonSelectionSchema}>
      {formikProps => (
        <>
          <EditBasicFields {...props} {...formikProps} />
          {props.mode === "add" && <AddButton {...formikProps} />}
        </>
      )}
    </Formik>
  )
}

export const styles = StyleSheet.create({
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
  trashIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
})

export default EditTopicPersonSelection
