import React from "react"
import * as PushNotification from "react-native-push-notification"
import { getLastNotified, setLastNotified } from "../lib/notification"

interface Props {}

interface State {}

const TARGET_HOUR = 22
const TARGET_MINUTES = 0

export default class NotificationHandler extends React.Component<Props, State> {
  lastNotified: Date | null = null

  constructor(props: Props) {
    super(props)
  }

  async componentDidMount() {
    // this check might be called too often. not sure.
    const lastNotified = await getLastNotified()

    const now = new Date()
    if (!lastNotified || lastNotified.getDate() !== now.getDate()) {
      PushNotification.localNotificationSchedule({
        title: "Memoneo Reminder",
        message: "Every day is Memoneo day.", // (required)
        date: this.retrieveNextDate(), // in 60 secs
        id: 4838,
        playSound: false,
      })

      setLastNotified(now)
    }
  }

  retrieveNextDate = (): Date => {
    const now = new Date()

    const hours = now.getHours()
    const minutes = now.getMinutes()

    now.setHours(TARGET_HOUR)
    now.setMinutes(TARGET_MINUTES)

    if (
      hours < TARGET_HOUR ||
      (hours === TARGET_HOUR && minutes <= TARGET_MINUTES)
    ) {
      return now
    }

    now.setDate(now.getDate() + 1)
    return now
  }

  render(): JSX.Element {
    return <></>
  }
}
