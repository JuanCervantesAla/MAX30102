#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <WiFi.h>
#include <ESPAsyncWebServer.h>

// Instancia del sensor MAX30105
MAX30105 particleSensor;

// Configuración de tasa de muestreo para el cálculo de BPM
const byte RATE_SIZE = 4; // Aumenta esto para más promediado. 4 es un buen valor.
byte rates[RATE_SIZE]; // Array de BPMs
byte rateSpot = 0;
long lastBeat = 0; // Hora en la que ocurrió el último latido

float beatsPerMinute;
int beatAvg;

// Configuración de Wi-Fi en modo Access Point
const char *ssid = "ESP32_HeartRate";  // Nombre de la red Wi-Fi (el AP)
const char *password = "123456789";    // Contraseña del AP

// Crear servidor web en el puerto 80
AsyncWebServer server(80);

void setup() {
  // Iniciar comunicación serial
  Serial.begin(115200);
  Serial.println("Initializing...");

  // Configuración del bus I2C en los pines 18 (SDA) y 19 (SCL)
  Wire.begin(18, 19); // SDA en el pin 18, SCL en el pin 19
  Wire.setClock(400000); // Establece la velocidad del I2C a 400 kHz

  // Inicializar el sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) { // Usar el bus I2C con velocidad rápida de 400kHz
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1); // Si no se encuentra el sensor, detiene el programa
  }

  Serial.println("Place your index finger on the sensor with steady pressure.");

  // Configurar el sensor con los valores predeterminados
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A); // Configura el LED rojo
  particleSensor.setPulseAmplitudeGreen(0);  // Apagar el LED verde

  // Configuración del ESP32 como Access Point
  WiFi.softAP(ssid, password);  // Crear el AP con el nombre de red y contraseña
  Serial.println("Access Point Started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());  // Muestra la dirección IP del ESP32 (punto de acceso)

  // Manejar la solicitud GET en la raíz ("/")
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
    response->addHeader("Access-Control-Allow-Origin", "*"); // Permitir acceso desde cualquier origen
    request->send(response);
  });

  // Iniciar el servidor web
  server.begin();
}

void loop() {
  // Leer el valor IR del sensor
  long irValue = particleSensor.getIR();

  // Verificar si se detectó un latido
  if (checkForBeat(irValue) == true) {
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0); // Calcular los latidos por minuto

    if (beatsPerMinute < 255 && beatsPerMinute > 20) {
      rates[rateSpot++] = (byte)beatsPerMinute; // Almacenar el valor del BPM
      rateSpot %= RATE_SIZE; // Envolver la variable

      // Promediar las lecturas de BPM
      beatAvg = 0;
      for (byte x = 0; x < RATE_SIZE; x++) {
        beatAvg += rates[x];
      }
      beatAvg /= RATE_SIZE;
    }
  }

  // Verificar si no se detecta un dedo
  if (irValue < 50000) {
    Serial.print(" No finger? ");
    Serial.println();
  } else {
    // Imprimir los valores de BPM y avg BPM más rápidamente en el Serial Monitor
    Serial.print("BPM: ");
    Serial.print(beatsPerMinute);
    Serial.print(" | Avg BPM: ");
    Serial.println(beatAvg);
  }

  // Reducir el tiempo de espera para la actualización de BPM
  delay(10); // Reducido para hacer el ciclo más rápido
}

