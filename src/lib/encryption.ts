import { NativeModules, Platform } from "react-native"
import { DEFAULT_SALT, DEFAULT_IV } from "../../config"
var Aes = NativeModules.Aes

// TODO check if I should use this instead to save as textEncryptionKey in SecureStore
export async function generateKey(password: string): Promise<string> {
  return await Aes.pbkdf2(password, DEFAULT_SALT, 5000, 256)
}

const IV_SEPARATOR = "<|>"

export async function encryptText(
  originalText: string,
  key: string
): Promise<string> {
  const actualKey = await generateKey(key)
  const iv = await Aes.randomKey(16)
  const encryptedText = await Aes.encrypt(originalText, actualKey, iv)

  //console.log("Original text " + originalText)
  //const output = iv + IV_SEPARATOR + encryptedText
  /*
  console.log(output)
  const newText = await decryptText(output, newKey)
  console.log("Decrypted text " + newText)
  */

  return iv + IV_SEPARATOR + encryptedText
}

export async function decryptText(
  cipherText: string,
  key: string
): Promise<string> {
  //console.log("Decrypting")
  const cipherSplit = cipherText.split(IV_SEPARATOR)
  const iv = cipherSplit[0]
  const encryptedText = cipherSplit[1]
  const newKey = await generateKey(key)

  const decryptedText = await Aes.decrypt(encryptedText, newKey, iv)
  //console.log(decryptedText)
  return decryptedText
}