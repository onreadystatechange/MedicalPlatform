package com.medicalplatform;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.cboy.rn.splashscreen.SplashScreen;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     @Override
     protected void onCreate(Bundle savedInstanceState) {
         SplashScreen.show(this);  // here
         super.onCreate(savedInstanceState);
     }

    @Override
    protected String getMainComponentName() {
        return "MedicalPlatform";
    }
}
