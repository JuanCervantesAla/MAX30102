import React, { useEffect, useState } from "react";

function HeartRateMonitor() {
  const [bpm, setBpm] = useState("Cargando...");
  const [avgBpm, setAvgBpm] = useState("Cargando...");
  const [error, setError] = useState(null); // Nuevo estado para errores
  const esp32IP = "192.168.4.1"; // IP del ESP32

  const fetchBPMData = async () => {
    try {
      const response = await fetch(`http://${esp32IP}/getBPM`);
      if (response.ok) {
        const data = await response.json();
        setBpm(data.bpm);
        setAvgBpm(data.avg_bpm);
        setError(null); // Reiniciar el estado de error si la respuesta es correcta
      } else {
        throw new Error("Error al obtener los datos del ESP32.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setError("No se pudo conectar con el ESP32.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBPMData();
    }, 1000); // Actualiza cada segundo
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Monitor de Frecuencia Cardíaca</h1>
      {error ? (
        <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>
      ) : (
        <>
          <p><strong>BPM:</strong> {bpm}</p>
          <p><strong>BPM Promedio:</strong> {avgBpm}</p>
        </>
      )}
    </div>
  );
}

export default HeartRateMonitor;
