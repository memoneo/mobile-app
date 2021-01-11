import { SecureStore } from "./reexports"
import {
  SECURE_STORE_HASH_KEY,
  SECURE_STORE_ENCRYPTION_KEY,
} from "../../config"
import protect from "await-protect"

export async function getHash(): Promise<string> {
  const [hash, err] = await protect<string, Error>(
    SecureStore.getItemAsync(SECURE_STORE_HASH_KEY)
  )

  return hash ?? ""
}

export async function resetHash(): Promise<Error | undefined> {
  const [_, err] = await protect<void, Error>(
    SecureStore.setItemAsync(SECURE_STORE_HASH_KEY, "")
  )

  return err
}

export async function getTextEncryptionKey(): Promise<[string, Error]> {
  return await protect<string, Error>(
    SecureStore.getItemAsync(SECURE_STORE_ENCRYPTION_KEY)
  )
}

export async function setTextEncryptionKey(
  textEncryptionKey: string
): Promise<[void, Error]> {
  return await protect<void, Error>(
    SecureStore.setItemAsync(SECURE_STORE_ENCRYPTION_KEY, textEncryptionKey)
  )
}
