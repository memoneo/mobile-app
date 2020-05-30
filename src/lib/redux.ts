import { SecureStore } from "./reexports"
import { SECURE_STORE_HASH_KEY } from "../../config"
import protect from "await-protect"

export async function getHash(): Promise<string> {
  const { ok, err } = await protect(
    SecureStore.getItemAsync(SECURE_STORE_HASH_KEY)
  )

  return ok ? ok : ""
}
