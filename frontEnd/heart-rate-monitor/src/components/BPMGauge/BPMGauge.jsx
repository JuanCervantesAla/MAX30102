import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const BPMGauge = ({ bpm }) => {
  const maxBPM = 200;

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
