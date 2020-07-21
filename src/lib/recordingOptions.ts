import * as Audio from "expo-av"
import {
  RecordingOptions,
  RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
  RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
  RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
} from "expo-av/build/Audio"

const RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_VORBIS = 9
const RECORDING_OPTION_ANDROID_AUDIO_ENCODER_VORBIS = 6

const recordingOptions: RecordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 16000,
    bitRate: 12000,
    numberOfChannels: 1,
  },
  ios: {
    extension: ".caf",
    audioQuality: RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
}

export default recordingOptions