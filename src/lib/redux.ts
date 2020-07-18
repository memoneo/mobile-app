import { SecureStore } from "./reexports"
import {
  SECURE_STORE_HASH_KEY,
  SECURE_STORE_ENCRYPTION_KEY,
} from "../../config"
import protect, { Result } from "await-protect"

export async function getHash(): Promise<string> {
  const { ok, err } = await protect<string, Error>(
    SecureStore.getItemAsync(SECURE_STORE_HASH_KEY)
  )

  return ok ? ok : ""
}

export async function getTextEncryptionKey(): Promise<Result<string, Error>> {
  return await protect<string, Error>(
    SecureStore.getItemAsync(SECURE_STORE_ENCRYPTION_KEY)
  )
}

export async function setTextEncryptionKey(
  textEncryptionKey: string
): Promise<Result<void, Error>> {
  return await protect<void, Error>(
    SecureStore.setItemAsync(SECURE_STORE_ENCRYPTION_KEY, textEncryptionKey)
  )
}
