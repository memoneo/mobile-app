import { SecureStore } from "./reexports"
import protect from "await-protect"

const LAST_NOTIFIED_KEY = "last_notified"

export async function getLastNotified(): Promise<Date | null> {
  const { ok, err } = await protect(SecureStore.getItemAsync(LAST_NOTIFIED_KEY))

  return ok ? new Date(parseInt(ok)) : null
}

export async function setLastNotified(lastNotified: Date): Promise<void> {
  const { ok, err } = await protect(
    SecureStore.setItemAsync(
      LAST_NOTIFIED_KEY,
      lastNotified.getTime().toString()
    )
  )
    
  // probably I could just remove protect here
  if (err) throw err
}
