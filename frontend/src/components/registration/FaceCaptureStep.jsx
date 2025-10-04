import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Button from '../common/Button';
// NOTE: LivenessCheck component would be used here for a real implementation
// For simplicity in this step, we will use a direct webcam capture.

const FaceCaptureStep = ({ onNext, onBack }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const handleNext = () => {
    if (imgSrc) {
      onNext(imgSrc); // Pass the captured image data to the parent
    }
  };

  return (
    <div>
      <h3 className="form-step-title">Step 2: Face Registration</h3>
      <p style={{textAlign: 'center', color: '#6b7280', marginBottom: '1rem'}}>
        Please look directly into the camera and capture a clear photo.
      </p>
      <div className="liveness-checker">
        {imgSrc ? (
          <img src={imgSrc} alt="Captured face" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="webcam-container"
          />
        )}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button onClick={onBack} variant="secondary" style={{ flexGrow: 1 }}>Back</Button>
        {imgSrc ? (
          <Button onClick={handleNext} style={{ flexGrow: 1 }}>Next: Review</Button>
        ) : (
          <Button onClick={capture} style={{ flexGrow: 1 }}>Capture Photo</Button>
        )}
      </div>
    </div>
  );
};

export default FaceCaptureStep;