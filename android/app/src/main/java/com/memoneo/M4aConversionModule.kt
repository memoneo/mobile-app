package com.memoneo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import nl.bravobit.ffmpeg.ExecuteBinaryResponseHandler
import nl.bravobit.ffmpeg.FFmpeg

class M4aConversionModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "M4aConversion"

    @ReactMethod
    fun convertM4aToWav(fileUri: String, promise: Promise) {
        val ffmpeg = FFmpeg.getInstance(reactContext)
        val newFileUri = fileUri.replace(".m4a", ".wav")

        ffmpeg.execute(arrayOf("-i", fileUri, newFileUri), object : ExecuteBinaryResponseHandler() {
            override fun onStart() {}

            override fun onProgress(message: String?) {}

            override fun onFailure(message: String?) {
                promise.reject(RuntimeException(message))
            }

            override fun onSuccess(message: String?) {
                promise.resolve(newFileUri)
            }

            override fun onFinish() {}
        })
    }

    @ReactMethod
    fun convertM4aToOgg(fileUri: String, promise: Promise) {
        val ffmpeg = FFmpeg.getInstance(reactContext)
        val newFileUri = fileUri.replace(".m4a", ".ogg")

        ffmpeg.execute(arrayOf("-i", fileUri, newFileUri), object : ExecuteBinaryResponseHandler() {
            override fun onStart() {}

            override fun onProgress(message: String?) {}

            override fun onFailure(message: String?) {
                promise.reject(RuntimeException(message))
            }

            override fun onSuccess(message: String?) {
                promise.resolve(newFileUri)
            }

            override fun onFinish() {}
        })
    }
}