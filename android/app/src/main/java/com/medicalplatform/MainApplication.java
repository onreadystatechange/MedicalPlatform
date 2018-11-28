package com.medicalplatform;

import android.app.Application;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import cn.reactnative.modules.update.UpdatePackage;
import cn.reactnative.modules.update.UpdateContext;
import com.rnfs.RNFSPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return UpdateContext.getBundleUrl(MainApplication.this);
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSentryPackage(MainApplication.this),
            new UpdatePackage(),
            new RNFSPackage(),
          new RealmReactPackage(),
            new SplashScreenReactPackage(),
            new PickerPackage(),
          new SvgPackage(),
          new VectorIconsPackage(),
          new ImagePickerPackage(),
          new RCTCameraPackage()
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
  }
}
