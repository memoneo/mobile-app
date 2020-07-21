import {
  User,
  TopicLogDateType,
  Topic,
  Person,
  TopicType,
} from "memoneo-common/lib/types"
import { AddEntryDate } from "../types/AddEntry"
import { dayjs } from "./reexports"

export function getNameFromUser(user: User): string {
  return `$`
}

export function formatAddEntryDate(addEntryDate: AddEntryDate): string {
  if (addEntryDate instanceof Date) {
    return dayjs(addEntryDate).format("DD-MM-YYYY")
  }

  throw new Error(`AddEntryDate ${addEntryDate} is not supported`)
}

export function formatTopicName(
  topic: Topic,
  topicLogDateType: TopicLogDateType
): string {
  let topicLogDateTypeStr: string
  let topicLogDateTypeNextStr: string
  switch (topicLogDateType) {
    case "daily":
      topicLogDateTypeStr = "today"
      topicLogDateTypeNextStr = "tomorrow"
      break
    case "monthly":
      topicLogDateTypeStr = "this month"
      topicLogDateTypeNextStr = "next month"
      break
    case "weekly":
      topicLogDateTypeStr = "this week"
      topicLogDateTypeNextStr = "next week"
      break
    case "yearly":
      topicLogDateTypeStr = "this year"
      topicLogDateTypeNextStr = "next year"
      break
  }

  return topic.name
    .replace("{timeScope}", topicLogDateTypeStr)
    .replace("{timeScopeNext}", topicLogDateTypeNextStr)
}

export function formatPersonName(person: Person): string {
  return `${person.name} ${person.surname}`
}

export function formatTopicTypeName(topicType: TopicType): string {
  switch (topicType) {
    case "person-selection":
      return "Person Selection"
    case "selection":
      return "Selection"
    case "text-simple":
      return "Text"
    case "text-5rated":
      return "Text 5-Scale Rated"
    case "goal-selection":
      return "Goal"
  }
}

export function formatDateType(dateType: TopicLogDateType): string {
  switch (dateType) {
    case "daily":
      return "Daily"
    case "monthly":
      return "Monthly"
    case "weekly":
      return "Weekly"
    case "yearly":
      return "Yearly"
  }
}
