package com.memoneo

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import java.util.Collections.emptyList
import com.facebook.react.ReactPackage
import com.facebook.react.uimanager.ViewManager
import java.util.*
import kotlin.collections.ArrayList

class M4aConversionPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    override fun createNativeModules(
            reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()

        modules.add(M4aConversionModule(reactContext))

        return modules
    }
}