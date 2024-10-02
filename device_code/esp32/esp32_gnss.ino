#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// LTE-M modem settings
#define TINY_GSM_MODEM_SIM7000
#include <TinyGsmClient.h>

// Your GPRS credentials, if any
const char apn[] = "YOUR_APN";
const char gprsUser[] = "";
const char gprsPass[] = "";

// Server details
const char server[] = "your-server-ip-or-domain.com";  // Update this with your backend server address
const int port = 3000;  // Update this with your backend server port

// Device ID
const int deviceId = 1;  // Update this with the actual device ID

// GNSS module connection
HardwareSerial gpsSerial(2);  // Use UART2 for GPS
TinyGPSPlus gps;

// LTE-M module connection
HardwareSerial lteSerial(1);  // Use UART1 for LTE-M
TinyGsm modem(lteSerial);

// HTTP client
TinyGsmClient client(modem);
HTTPClient http;

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600);
  lteSerial.begin(115200);

  // Initialize LTE-M connection
  Serial.println("Initializing modem...");
  modem.restart();

  Serial.println("Connecting to network...");
  if (!modem.gprsConnect(apn, gprsUser, gprsPass)) {
    Serial.println("Failed to connect to network");
    return;
  }

  Serial.println("Connected to network");
}

void loop() {
  while (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      if (gps.location.isValid()) {
        float latitude = gps.location.lat();
        float longitude = gps.location.lng();

        // Create JSON payload
        DynamicJsonDocument doc(200);
        doc["deviceId"] = deviceId;
        doc["latitude"] = latitude;
        doc["longitude"] = longitude;

        String payload;
        serializeJson(doc, payload);

        // Send data to server
        String url = String("/api/devices/") + String(deviceId) + String("/location");
        http.begin(client, server, port, url);
        http.addHeader("Content-Type", "application/json");

        int httpResponseCode = http.POST(payload);

        if (httpResponseCode > 0) {
          String response = http.getString();
          Serial.println("HTTP Response code: " + String(httpResponseCode));
          Serial.println(response);
        } else {
          Serial.println("Error on sending POST: " + String(httpResponseCode));
        }

        http.end();

        // Wait for a while before sending the next update
        delay(60000);  // 1 minute delay
      }
    }
  }
}