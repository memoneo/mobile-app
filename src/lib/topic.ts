import { TopicType } from "memoneo-common/lib/types"

export function isTextTopic(topicType: TopicType): boolean {
  return topicType === "text-5rated" || topicType === "text-simple"
}
