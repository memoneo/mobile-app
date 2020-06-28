package com.memoneo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.memoneo.generated.BasePackageList;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.swmansion.reanimated.ReanimatedPackage;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;

import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

import java.util.Arrays;
import java.util.List;

import nl.bravobit.ffmpeg.FFmpeg;
import com.tectiv3.aes.RCTAesPackage;

/**
 * Remains in Java due to better compatibility with React Native.
 */
public class MainApplication extends Application implements ReactApplication {
    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
            new BasePackageList().getPackageList(),
            Arrays.asList()
    );

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(
                    new MainReactPackage(),
                    new ReactNativePushNotificationPackage(),
                    new AsyncStoragePackage(),
                    new RNFSPackage(),
                    new RCTAesPackage(),
                    // START doesn't support autolinking
                    new SvgPackage(),
                    new RNGestureHandlerPackage(),
                    new SafeAreaContextPackage(),
                    new ReanimatedPackage(),
                    new RNDateTimePickerPackage(),
                    // END doesn't support autolinking
                    new M4aConversionPackage(),
                    new ModuleRegistryAdapter(mModuleRegistryProvider)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        if (FFmpeg.getInstance(this).isSupported()) {
            // ffmpeg is supported
        } else {
            // ffmpeg is not supported
        }
    }
}
