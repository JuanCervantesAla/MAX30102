#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>

MAX30105 particleSensor;

const byte RATE_SIZE = 4;
byte rates[RATE_SIZE];
byte rateSpot = 0;
long lastBeat = 0;

float beatsPerMinute;
int beatAvg;

const char *ssid = "ESP32_HeartRate";
const char *password = "123456789";

AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing...");

  Wire.begin(18, 19); 
  Wire.setClock(400000); 

  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1);
  }

  Serial.println("Place your index finger on the sensor with steady pressure.");
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);

  WiFi.softAP(ssid, password);
  Serial.println("Access Point Started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    String html = "<html><body>";
    html += "<h1>ESP32 Heart Rate Monitor</h1>";
    html += "<p>BPM: <span id='bpm'>loading...</span></p>";
    html += "<p>Avg BPM: <span id='avgBpm'>loading...</span></p>";
    html += "<script>";
    html += "function updateBPM() {";
    html += "fetch('/getBPM').then(response => response.json()).then(data => {";
    html += "document.getElementById('bpm').innerText = data.bpm;";
    html += "document.getElementById('avgBpm').innerText = data.avg_bpm;";
    html += "});";
    html += "}"; 
    html += "setInterval(updateBPM, 1000);";
    html += "</script>";
    html += "</body></html>";
    request->send(200, "text/html", html);
  });

  server.on("/getBPM", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{\"bpm\": " + String(beatsPerMinute) + ", \"avg_bpm\": " + String(beatAvg) + "}";
    AsyncWebServerResponse *response = request->beginResponse(200, "application/json", json);
    response->addHeader("Access-Control-Allow-Origin", "*");
    request->send(response);
  });

  server.begin();
}

void loop() {
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0); 

    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute; 
      rateSpot %= RATE_SIZE; 

      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++) {
        beatAvg += rates[x];
      }
      beatAvg /= RATE_SIZE;
    }
  }

  if (irValue < 50000) {
    Serial.print(" No finger? ");
    Serial.println();
  } else {
    Serial.print("BPM: ");
    Serial.print(beatsPerMinute);
    Serial.print(" | Avg BPM: ");
    Serial.println(beatAvg);
  }

  delay(10);
}

