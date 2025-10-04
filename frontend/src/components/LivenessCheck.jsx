import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const LIVENESS_WEBSOCKET_URL = 'ws://127.0.0.1:8000/ws/vision/verify';

const LivenessCheck = ({ onSuccess, onFailure }) => {
  const webcamRef = useRef(null);
  // ... (all the logic remains the same) ...
  const [statusMessage, setStatusMessage] = useState('Initializing camera...');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // ... (WebSocket logic is identical) ...
  }, [onSuccess, onFailure]);

  return (
    <div className="liveness-checker">
      <div className="webcam-container" style={{ borderColor: isChecking ? '#3B82F6' : '#9CA3AF' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          style={{ width: '100%' }}
        />
      </div>
      <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>{statusMessage}</p>
    </div>
  );
};

export default LivenessCheck;