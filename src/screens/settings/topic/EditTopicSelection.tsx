import * as React from "react"
import { StyleSheet } from "react-native"
import { TopicLogValueTextSimple } from "memoneo-common/lib/types"
import { FormikProps, Formik } from "formik"
import { EditTopicInnerSubProps } from "./EditTopic"
import { Yup } from "../../../lib/reexports"
import EditTopicBasic from "./EditTopicBasic"

interface FormValues {
  name: string
  optional: boolean
}

interface Props extends EditTopicInnerSubProps {}

interface FormProps extends FormikProps<FormValues> {
  value?: TopicLogValueTextSimple
}

const EditTopicSelectionSchema = Yup.object().shape({
  name: Yup.string().min(1).max(16).required("Name is required"),
  optional: Yup.boolean(),
})

function EditTopicSelection(props: Props): JSX.Element {
  function handleSubmit(values: FormValues) {}

  return (
    <Formik<FormValues>
      initialValues={{ name: props.topic.name, optional: props.topic.optional }}
      onSubmit={handleSubmit}
      validationSchema={EditTopicSelectionSchema}>
      {formikProps => (
        <>
          <EditTopicBasic {...props} {...formikProps} />
        </>
      )}
    </Formik>
  )
}

export const styles = StyleSheet.create({})

export default EditTopicSelection
