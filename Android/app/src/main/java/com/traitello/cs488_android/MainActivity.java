package com.traitello.cs488_android;

import android.app.Activity;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorManager;
import android.hardware.SensorEventListener;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.text.format.Formatter;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.http.protocol.HttpService;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;


public class MainActivity extends Activity  implements SensorEventListener {

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private long lastUpdate;
    private TextView ipAddress;
    private TextView status;
    private TextView xValue;
    private TextView yValue;
    private TextView zValue;
    private float currentX;
    private float currentY;
    private float currentZ;
    private WrapperHTTP server;
    private WifiManager wifi;
    int wifiIpAddressInt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        sensorManager.registerListener(this, accelerometer,SensorManager.SENSOR_DELAY_NORMAL);
        lastUpdate = System.currentTimeMillis();

        ipAddress = (TextView) findViewById(R.id.ipAddress);
        status = (TextView) findViewById(R.id.currentStatus);
        xValue = (TextView) findViewById(R.id.xValue);
        yValue = (TextView) findViewById(R.id.yValue);
        zValue = (TextView) findViewById(R.id.zValue);

        wifi=(WifiManager)getSystemService(WIFI_SERVICE);

        try {
            server = new WrapperHTTP();
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void setIpText(){
       ;
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float[] values = event.values;
        currentX = values[0];
        currentY = values[1];
        currentZ = values[2];

        xValue.setText(Float.toString(currentX).substring(0,4));
        yValue.setText(Float.toString(currentY).substring(0,4));
        zValue.setText(Float.toString(currentZ).substring(0,4));

        long actualTime = event.timestamp;
        lastUpdate = actualTime;

        wifiIpAddressInt = wifi.getDhcpInfo().ipAddress;
        ipAddress.setText(intToIP(wifiIpAddressInt) + ":8080");


        try {
            createJSON();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void computeDirection(){

    }

    private void createJSON() throws JSONException {
        JSONObject json = new JSONObject();
        JSONObject data = new JSONObject();
        data.put("x_value", currentX);
        data.put("y_value", currentY);
        data.put("z_value", currentZ);
        json.put("Values", data);
        //System.out.println(json.toString());
        server.setJSON(json.toString());
        if(server.isAlive()) {
            status.setText("Running");
            setIpText();
        }
        else status.setText("Not Running");
        //return json;
    }

    /*public String getLocalIpAddress() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements();) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        String ip = Formatter.formatIpAddress(inetAddress.hashCode());
                        //Log.i(TAG, "***** IP="+ ip);
                        return ip;
                    }
                }
            }
        } catch (SocketException ex) {
            //Log.e(TAG, ex.toString());
        }
        return null;
    }*/




    public String intToIP(int i) {
        return (( i & 0xFF)+ "."+((i >> 8 ) & 0xFF)+
                "."+((i >> 16 ) & 0xFF)+"."+((i >> 24 ) & 0xFF));
    }

}
