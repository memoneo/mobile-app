import * as React from "react"
import { StyleSheet } from "react-native"
import { TopicLogValueTextSimple } from "memoneo-common/lib/types"
import { FormikProps, Formik } from "formik"
import { Yup } from "../../../lib/reexports"
import { EditTopicInnerSubProps } from "./EditTopic"
import EditTopicBasic from "./EditTopicBasic"

interface FormValues {
  name: string
  optional: boolean
}

interface Props extends EditTopicInnerSubProps {}

interface FormProps extends FormikProps<FormValues> {
  value?: TopicLogValueTextSimple
}

const EditTopicTextSchema = Yup.object().shape({
  name: Yup.string()
    .min(1)
    .max(16)
    .required("Name is required"),
  optional: Yup.boolean(),
})

function EditTopicText(props: Props): JSX.Element {
  return (
    <Formik<FormValues>
      initialValues={{ name: props.topic.name, optional: props.topic.optional }}
      onSubmit={() => {}}
      validationSchema={EditTopicTextSchema}>
      {formikProps => (
        <>
          <EditTopicBasic {...props} {...formikProps} />
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

export default EditTopicText
