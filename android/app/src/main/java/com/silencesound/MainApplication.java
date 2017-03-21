package com.silencesound;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.appevents.AppEventsLogger;

 import android.content.pm.PackageInfo; 
 import android.content.pm.PackageManager;
  import android.content.pm.PackageManager.NameNotFoundException;
   import android.content.pm.Signature;
    import android.util.Base64; 
    import android.util.Log;
    import java.security.MessageDigest ;

import java.util.Arrays;
import java.util.List;
    import cn.mandata.react_native_mpchart.MPChartPackage;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new BackgroundTimerPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage()
      );
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
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);

     try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    "com.silencesound", 
                    PackageManager.GET_SIGNATURES);
            
        } catch (NameNotFoundException e) {

        } catch (Exception e) {

        }
  }
}
