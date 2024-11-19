import React, { useEffect, useState } from "react";
import { Heart, Activity, AlertCircle } from "lucide-react";

const HeartRateMonitor = () => {
  const [bpm, setBpm] = useState("--");
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
        setBpm(data.bpm);
        setAvgBpm(data.avg_bpm);
        setError(null);
        setStatus("success");
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
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold mb-2">
                  <span className={getBPMColor(bpm)}>{bpm}</span>
                  <span className="text-lg text-gray-500 ml-2">BPM</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Frecuencia en tiempo real</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Promedio</p>
                  <p className="text-2xl font-semibold text-blue-600">{avgBpm} BPM</p>
                </div>
              </div>

              {status === "loading" && (
                <div className="text-center text-sm text-gray-500">
                  Actualizando datos...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;
