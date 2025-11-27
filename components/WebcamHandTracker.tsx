
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { HandData, GestureType } from '../types';

interface Props {
  onHandUpdate: (data: HandData) => void;
  enabled: boolean;
}

const WebcamHandTracker: React.FC<Props> = ({ onHandUpdate, enabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const initMediapipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        setLoading(false);
        startWebcam();
      } catch (err) {
        console.error(err);
        setError("Failed to load AI model");
        setLoading(false);
      }
    };

    if (enabled) {
      initMediapipe();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled]);

  const startWebcam = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Webcam not supported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadeddata', predictWebcam);
      }
    } catch (err) {
      setError("Camera permission denied");
    }
  };

  const isFingerExtended = (landmarks: NormalizedLandmark[], fingerTipIdx: number, fingerPipIdx: number) => {
    return landmarks[fingerTipIdx].y < landmarks[fingerPipIdx].y;
  };

  const predictWebcam = () => {
    if (!handLandmarkerRef.current || !videoRef.current) return;
    
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }

    const nowInMs = Date.now();
    const results = handLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);

    let handData: HandData = {
      isDetected: false,
      pinchDistance: 0,
      centerX: 0,
      centerY: 0,
      gesture: GestureType.NONE
    };

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      
      // Calculate Pinch (Thumb Tip to Index Tip)
      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];
      
      const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2)
      );
      const normalizedPinch = Math.min(Math.max((distance - 0.02) / 0.15, 0), 1);

      // Determine extended fingers
      // Tip Indices: 8 (Index), 12 (Middle), 16 (Ring), 20 (Pinky)
      // PIP Indices: 6, 10, 14, 18
      const indexExtended = isFingerExtended(landmarks, 8, 6);
      const middleExtended = isFingerExtended(landmarks, 12, 10);
      const ringExtended = isFingerExtended(landmarks, 16, 14);
      const pinkyExtended = isFingerExtended(landmarks, 20, 18);

      const extendedCount = (indexExtended ? 1 : 0) + (middleExtended ? 1 : 0) + (ringExtended ? 1 : 0) + (pinkyExtended ? 1 : 0);

      let gesture = GestureType.NONE;

      // Logic Priority
      if (normalizedPinch < 0.1) {
        gesture = GestureType.PINCH;
      } else if (extendedCount === 0) {
        gesture = GestureType.CLOSED_FIST;
      } else if (extendedCount === 1 && indexExtended) {
        gesture = GestureType.POINTING;
      } else if (extendedCount === 2 && indexExtended && middleExtended) {
        gesture = GestureType.VICTORY;
      } else if (extendedCount >= 4) {
        gesture = GestureType.OPEN_HAND;
      }

      const wrist = landmarks[0];

      handData = {
        isDetected: true,
        pinchDistance: normalizedPinch,
        centerX: (wrist.x - 0.5) * -2, 
        centerY: (wrist.y - 0.5) * -2,
        gesture
      };
    }

    onHandUpdate(handData);
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  if (!enabled) return null;

  return (
    <div className="absolute top-4 right-4 w-32 h-24 bg-black border border-gray-700 rounded-lg overflow-hidden z-50 opacity-80 shadow-lg group">
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover transform scale-x-[-1]" 
        autoPlay 
        playsInline 
        muted
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-xs text-white">
          Loading AI...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-xs text-white p-2 text-center">
          {error}
        </div>
      )}
      <div className="absolute bottom-1 left-1 text-[10px] text-green-400 bg-black/50 px-1 rounded">
        AI Vision Active
      </div>
    </div>
  );
};

export default WebcamHandTracker;
