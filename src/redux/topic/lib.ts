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
    // console.log("===\nFound topicLogValue, decrypt?")
    if (topicLogValue.encrypted) {
      // console.log("Is encrypted with type " + topicLogValue.type)
      switch (topicLogValue.type) {
        case "text-simple":
        case "text-5rated":
          // console.log("Decrypting")
          const value = topicLogValue.value as
            | TopicLogValueTextSimple
            | TopicLogValueTextFiveRated
          const cipherText = value.text
          if (cipherText) {
            const decryptedText = await decryptText(cipherText, key)
            value.text = decryptedText
          }
        default:
          // console.log("Continuing")
          continue
      }
    }
    // console.log("===")
  }
}
