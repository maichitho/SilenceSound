package com.silencesound;

import com.facebook.react.ReactActivity;
import android.content.Intent;
 import android.content.pm.PackageInfo; 
 import android.content.pm.PackageManager;
  import android.content.pm.PackageManager.NameNotFoundException;
   import android.content.pm.Signature;
    import android.util.Base64; 
    import android.util.Log;
    import java.security.MessageDigest ;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SilenceSound";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
