import React, { useEffect, useState } from "react";
import { Heart, Activity, AlertCircle } from "lucide-react";

const HeartRateMonitor = ({ setBpm }) => {
  const [bpm, setBpmLocal] = useState("--");
  const [avgBpm, setAvgBpm] = useState("--");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("loading");
  const esp32IP = "192.168.4.1";

  const getBPMColor = (bpmValue) => {
    const numBpm = Number(bpmValue);
    if (isNaN(numBpm)) return "text-gray-500";
    if (numBpm < 60) return "text-blue-500";
    if (numBpm > 100) return "text-red-500";
    return "text-green-500";
  };

  const fetchBPMData = async () => {
    try {
      setStatus("loading");
      const response = await fetch(`http://${esp32IP}/getBPM`);
      if (response.ok) {
        const data = await response.json();
        setBpmLocal(data.bpm);  // Actualizar BPM local
        setAvgBpm(data.avg_bpm);
        setError(null);
        setStatus("success");
        setBpm(data.bpm);  // Enviar al componente principal
      } else {
        throw new Error("Error al obtener los datos del ESP32");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setError("No se pudo conectar con el dispositivo");
      setStatus("error");
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchBPMData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Monitor Cardíaco
          </h2>
        </div>

        <div className="p-4">
          {status === "error" ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-3xl font-semibold text-center text-gray-800">
                  {bpm} BPM
                </p>
                <p className={`text-center ${getBPMColor(bpm)}`}>
                  {avgBpm} BPM Promedio
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;
