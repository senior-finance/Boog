package com.seniorfinance;

import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.provider.Telephony;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
        ArrayList<Map<String, Object>> smsList = new ArrayList<>();

        Uri uri = Telephony.Sms.CONTENT_URI;
        Cursor cursor = reactContext.getContentResolver().query(uri, null, null, null, null);
        if (cursor != null) {
            int bodyIdx = cursor.getColumnIndex("body");
            int addressIdx = cursor.getColumnIndex("address");
            int dateIdx = cursor.getColumnIndex("date");

            while (cursor.moveToNext()) {
                Map<String, Object> sms = new HashMap<>();
                sms.put("body", cursor.getString(bodyIdx));
                sms.put("sender", cursor.getString(addressIdx));
                sms.put("timestamp", cursor.getLong(dateIdx));
                smsList.add(sms);
            }
            cursor.close();
        }

        callback.invoke(smsList);
    }

    @ReactMethod
    public void getRecentCallLogs(Callback callback) {
        ArrayList<Map<String, Object>> callLogs = new ArrayList<>();

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
                Map<String, Object> log = new HashMap<>();
                log.put("number", cursor.getString(numberIdx));
                log.put("timestamp", cursor.getLong(dateIdx));
                log.put("duration", cursor.getInt(durationIdx));
                callLogs.add(log);
            }
            cursor.close();
        }

        callback.invoke(callLogs);
    }
}
