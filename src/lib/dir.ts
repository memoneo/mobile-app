import { TopicLogDateType } from "memoneo-common/lib/types"
import { FileSystem } from "react-native-unimodules"

/**
 * Returns the directory in which recordings are supposed to be saved, based on the [TopicLogDateType].
 */
export function getRecordingDirectory(topicLogDateType: TopicLogDateType, date: string): string {
    return `${FileSystem.documentDirectory}recordings/${topicLogDateType}/${date}`
}
