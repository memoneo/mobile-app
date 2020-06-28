import {
  TopicLogValueContainer,
  TopicLogValue,
  TopicLogValueTextSimple,
  TopicLogValueTextFiveRated,
} from "memoneo-common/lib/types"
import { decryptText } from "../../lib/encryption"

/**
 * Decrypt the text values of the received TopicLogValueContainers.
 *
 * Not sure if this mutability after awaiting is good. Test it for now.
 *
 * @param topicLogValues
 * @param key
 */
export async function decryptTopicLogValues(
  topicLogValues: TopicLogValueContainer<TopicLogValue>[],
  key: string
) {
  for (let topicLogValue of topicLogValues) {
    if (topicLogValue.encrypted) {
      switch (topicLogValue.type) {
        case "text-simple":
        case "text-5rated":
          const value = topicLogValue.value as
            | TopicLogValueTextSimple
            | TopicLogValueTextFiveRated
          const cipherText = value.text

          const decryptedText = await decryptText(cipherText, key)
          value.text = decryptedText
        default:
          continue
      }
    }
  }
}
