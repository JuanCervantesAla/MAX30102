#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

// Instancia del sensor MAX30105
MAX30105 particleSensor;

// Configuración de tasa de muestreo para el cálculo de BPM
const byte RATE_SIZE = 4; // Aumenta esto para más promediado. 4 es un buen valor.
byte rates[RATE_SIZE]; // Array de BPMs
byte rateSpot = 0;
long lastBeat = 0; // Hora en la que ocurrió el último latido

float beatsPerMinute;
int beatAvg;

void setup() {
  // Configuración de la comunicación serial
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
  particleSensor.setPulseAmplitudeRed(0x0A); // Configura el LED rojo a baja amplitud para indicar que el sensor está funcionando
  particleSensor.setPulseAmplitudeGreen(0);  // Apagar el LED verde
}

void loop() {
  // Leer el valor IR del sensor
  long irValue = particleSensor.getIR();

  // Verificar si se detectó un latido
  if (checkForBeat(irValue) == true) {
    // Si se detectó un latido
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

  // Imprimir los resultados en el monitor serial
  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  // Verificar si no se detecta un dedo
  if (irValue < 50000) {
    Serial.print(" No finger?");
  }

  Serial.println();
}


