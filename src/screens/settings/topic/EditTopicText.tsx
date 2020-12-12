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
import MText from "../../../components/common/MText"

interface FormValues extends BasicFormValues {}

interface Props extends EditTopicInnerSubProps {}

const EditTopicTextSchema = BasicEditSchema.clone()

function EditTopicText(props: Props): JSX.Element {
  return (
    <Formik<FormValues>
      initialValues={{
        ...getBasicInitialValues(props.topic),
      }}
      onSubmit={props.submitCreateTopicFromValues}
      validationSchema={EditTopicTextSchema}>
      {formikProps => (
        <>
          <EditBasicFields {...props} {...formikProps} />
          <MText>
            {formikProps.errors["name"]}
            {formikProps.errors["hasVoice"]}
            {formikProps.errors["optional"]}
          </MText>
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

export default EditTopicText
