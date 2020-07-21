import { NativeModules } from "react-native"

const m4aconvert = NativeModules.M4aConversion
export function convertM4aToWav(fileUri: string): Promise<string> {
    return m4aconvert.convertM4aToWav(fileUri)
}

export function convertM4aToOgg(fileUri: string): Promise<string> {
    return m4aconvert.convertM4aToOgg(fileUri)
}