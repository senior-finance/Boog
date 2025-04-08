package com.seniorfinance;

import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.provider.Telephony;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;

public class PhoneAnalysisModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public PhoneAnalysisModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "PhoneAnalysisModule";
    }

    @ReactMethod
    public void getAllSMS(Callback callback) {
        WritableNativeArray smsArray = new WritableNativeArray();

        Uri uri = Telephony.Sms.CONTENT_URI;
        Cursor cursor = reactContext.getContentResolver().query(uri, null, null, null, null);
        if (cursor != null) {
            int bodyIdx = cursor.getColumnIndex("body");
            int addressIdx = cursor.getColumnIndex("address");
            int dateIdx = cursor.getColumnIndex("date");

            while (cursor.moveToNext()) {
                WritableMap smsMap = new WritableNativeMap();
                smsMap.putString("body", cursor.getString(bodyIdx));
                smsMap.putString("sender", cursor.getString(addressIdx));
                // timestamp를 double 또는 int로 넣을 수 있습니다. 여기서는 double로 처리합니다.
                smsMap.putDouble("timestamp", cursor.getLong(dateIdx));
                smsArray.pushMap(smsMap);
            }
            cursor.close();
        }
        callback.invoke(smsArray);
    }

    @ReactMethod
    public void getRecentCallLogs(Callback callback) {
        WritableNativeArray callArray = new WritableNativeArray();

        Cursor cursor = reactContext.getContentResolver().query(
                CallLog.Calls.CONTENT_URI,
                null,
                null,
                null,
                CallLog.Calls.DATE + " DESC"
        );
        if (cursor != null) {
            int numberIdx = cursor.getColumnIndex(CallLog.Calls.NUMBER);
            int dateIdx = cursor.getColumnIndex(CallLog.Calls.DATE);
            int durationIdx = cursor.getColumnIndex(CallLog.Calls.DURATION);

            while (cursor.moveToNext()) {
                WritableMap callMap = new WritableNativeMap();
                callMap.putString("number", cursor.getString(numberIdx));
                callMap.putDouble("timestamp", cursor.getLong(dateIdx));
                callMap.putInt("duration", cursor.getInt(durationIdx));
                callArray.pushMap(callMap);
            }
            cursor.close();
        }
        callback.invoke(callArray);
    }
}
