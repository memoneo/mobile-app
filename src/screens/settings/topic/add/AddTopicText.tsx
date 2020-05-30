import * as React from "react"
import { StyleSheet, Switch, View } from "react-native"
import { Formik } from "formik"
import { Yup } from "../../../../lib/reexports"
import MText from "../../../../components/common/MText"
import MInput from "../../../../components/common/MInput"
import { AddTopicInnerSubProps, addTopicStyles } from "./AddTopic"
import { TopicTypeInfo, TopicType } from "memoneo-common/lib/types"
import MButton from "../../../../components/common/MButton"
import MError from "../../../../components/common/MError"
import AddTopicFormBasicFields from "./AddTopicFormBasicFields"

interface FormValues {
  name: string
  optional: boolean
  typeInfo: TopicTypeInfo
}

interface Props extends AddTopicInnerSubProps {
  typeName: TopicType
}

const AddTopicTextSchema = Yup.object().shape({
  name: Yup.string()
    .min(1)
    .max(64)
    .required("Name is required"),
  optional: Yup.boolean(),
})

function AddTopicText(props: Props): JSX.Element {
  const { errorCreate } = props

  return (
    <Formik<FormValues>
      initialValues={{
        name: "",
        optional: false,
        typeInfo: { type: props.typeName },
      }}
      onSubmit={props.submit}
      validationSchema={AddTopicTextSchema}>
      {formikProps => {
        const { handleSubmit } = formikProps

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

export default AddTopicText
