import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const BPMGauge = () => {
  const [bpm, setBPM] = useState(60);
  const maxBPM = 200;

  
  useEffect(() => {
    const interval = setInterval(() => {
      
      const newBPM = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
      setBPM(newBPM);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const normalizedBPM = bpm / maxBPM;

  return (
    <div style={{ width: '600px', margin: '0 auto' }}>
      <GaugeChart
        id="bpm-gauge-chart"
        nrOfLevels={30}
        percent={normalizedBPM}
        colors={['#FF0000', '#800080', '#0000FF']}
        arcWidth={0.3}
        textColor="#000"
        formatTextValue={() => `${bpm} BPM`}
      />
    </div>
  );
};

export default BPMGauge;
