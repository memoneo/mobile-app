import * as React from "react"
import { StyleSheet, Switch, View } from "react-native"
import { Formik } from "formik"
import { Yup } from "../../../../lib/reexports"
import { AddTopicInnerSubProps, addTopicStyles } from "./AddTopic"
import { TopicTypeInfo, TopicType } from "memoneo-common/lib/types"
import AddTopicFormBasicFields from "./AddTopicFormBasicFields"
import MButton from "../../../../components/common/MButton"
import MError from "../../../../components/common/MError"

interface FormValues {
  name: string
  optional: boolean
  typeInfo: TopicTypeInfo
}

interface Props extends AddTopicInnerSubProps {
  typeName: TopicType
}

const AddTopicPersonSelectionSchema = Yup.object().shape({
  name: Yup.string()
    .min(1)
    .max(64)
    .required("Name is required"),
  optional: Yup.boolean(),
})

function AddTopicPersonSelection(props: Props): JSX.Element {
  return (
    <Formik<FormValues>
      initialValues={{
        name: "",
        optional: false,
        typeInfo: { type: props.typeName },
      }}
      onSubmit={props.submit}
      validationSchema={AddTopicPersonSelectionSchema}>
      {formikProps => {
        const { values, handleChange, handleSubmit } = formikProps
        const { errorCreate } = props
        return (
          <>
            <AddTopicFormBasicFields {...props} {...formikProps} />
            {errorCreate.length > 0 && <MError text={errorCreate} />}
            <View style={addTopicStyles.addButtonContainer}>
              <MButton
                title="Add"
                buttonStyle={addTopicStyles.addButton}
                titleStyle={addTopicStyles.optionsButtonTitle}
                onPress={handleSubmit as any}
              />
            </View>
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

export default AddTopicPersonSelection
