import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  X,
  AlertCircle,
  Smartphone,
  FolderOpen,
  Settings,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export interface CameraScannerProps {
  onCapture: (blob: Blob, dataUrl: string, file: File) => void;
  onClose: () => void;
  onFallbackPhoneCamera?: () => void;
  onFallbackChooseImage?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  onClose,
  onFallbackPhoneCamera,
  onFallbackChooseImage,
}) => {
  // Required refs (Section 6)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // States
  const [status, setStatus] = useState<'initializing' | 'streaming' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorType, setErrorType] = useState<
    'permission' | 'notFound' | 'busy' | 'security' | 'unsupported' | 'interrupted' | 'generic'
  >('generic');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showSettingsHelp, setShowSettingsHelp] = useState<boolean>(false);

  // Cleanly stop every track and disconnect video element (Section 9)
  const stopCameraStream = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop warning:', e);
        }
      });
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Map individual browser camera errors to friendly messages (Section 12)
  const handleCameraError = useCallback((err: any) => {
    console.warn('Camera initialization error:', err?.name, err?.message, err);
    stopCameraStream();
    setStatus('error');

    const errName = err?.name || '';
    const errMsg = String(err?.message || '').toLowerCase();

    if (
      errName === 'NotAllowedError' ||
      errName === 'PermissionDeniedError' ||
      errMsg.includes('denied') ||
      errMsg.includes('not allowed')
    ) {
      setErrorType('permission');
      setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings.');
    } else if (
      errName === 'NotFoundError' ||
      errName === 'DevicesNotFoundError' ||
      errMsg.includes('not found') ||
      errMsg.includes('no device')
    ) {
      setErrorType('notFound');
      setErrorMessage('No camera was detected on this device.');
    } else if (
      errName === 'NotReadableError' ||
      errName === 'TrackStartError' ||
      errMsg.includes('busy') ||
      errMsg.includes('in use')
    ) {
      setErrorType('busy');
      setErrorMessage('The camera is currently being used by another application.');
    } else if (
      errName === 'SecurityError' ||
      errMsg.includes('secure context') ||
      errMsg.includes('feature policy') ||
      errMsg.includes('permission policy')
    ) {
      setErrorType('security');
      setErrorMessage('Live camera access is restricted in this preview. Try Use Phone Camera.');
    } else if (errName === 'OverconstrainedError') {
      setErrorType('unsupported');
      setErrorMessage('Camera settings not supported by this device. Try Use Phone Camera.');
    } else if (errName === 'AbortError') {
      setErrorType('interrupted');
      setErrorMessage('Camera initialization was interrupted. Please try again.');
    } else {
      setErrorType('generic');
      setErrorMessage('Camera access is not available in this browser.');
    }
  }, [stopCameraStream]);

  // Request real camera permission and attach live stream (Section 1, 2, 6, 7)
  const startCameraStream = useCallback(
    async (targetFacing: 'environment' | 'user' = facingMode) => {
      setStatus('initializing');
      setErrorMessage('');
      setShowSettingsHelp(false);

      // Section 2 & 4: Check browser camera support and secure context
      const hasMediaDevices = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

      if (!hasMediaDevices) {
        // Detect if insecure context or embedded preview limitation
        const isInsecure = typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost';
        const isIframe = typeof window !== 'undefined' && window.self !== window.top;

        if (isInsecure) {
          setErrorType('security');
          setErrorMessage('Camera access requires a secure HTTPS connection. Try Use Phone Camera.');
        } else if (isIframe) {
          setErrorType('security');
          setErrorMessage('Live camera access is restricted in this preview. Try Use Phone Camera.');
        } else {
          setErrorType('unsupported');
          setErrorMessage('Camera access is not available in this browser.');
        }
        setStatus('error');
        return;
      }

      // Stop any existing stream before starting a new one
      stopCameraStream();

      try {
        let stream: MediaStream;

        // Section 7: Mobile rear camera preference with fallback
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: targetFacing },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });
        } catch (firstErr: any) {
          console.warn('Ideal constraint failed, retrying with basic video constraint:', firstErr);
          // Retry with video: true rather than failing completely
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (!isMountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = stream;

        // Attach to real video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.setAttribute('muted', 'true');
          await videoRef.current.play();
        }

        setStatus('streaming');
        setFacingMode(targetFacing);

        // Check if multiple cameras are available for switch button
        try {
          if (navigator.mediaDevices.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = devices.filter((d) => d.kind === 'videoinput');
            setHasMultipleCameras(videoInputs.length > 1);
          }
        } catch (devErr) {
          console.warn('enumerateDevices check skipped:', devErr);
        }
      } catch (err: any) {
        if (!isMountedRef.current) return;
        handleCameraError(err);
      }
    },
    [facingMode, handleCameraError, stopCameraStream]
  );

  // Switch between front/rear cameras (Section 7)
  const toggleCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    startCameraStream(nextFacing);
  };

  // Section 8: Capture current live video frame to Blob and File
  const handleCapturePage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Trigger visual shutter flash
    setIsCapturing(true);

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Read actual current video frame & 2. Draw onto canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Get high-quality JPEG data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // 3. Convert canvas to Blob & 4. Create File object
    canvas.toBlob(
      (blob) => {
        let finalBlob = blob;
        if (!finalBlob) {
          // Fallback array buffer conversion if toBlob is null
          const byteString = atob(dataUrl.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          finalBlob = new Blob([ab], { type: 'image/jpeg' });
        }

        const file = new File([finalBlob], `scanned-book-page-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        // 7. Stop the camera stream
        stopCameraStream();

        // 5 & 6. Store and display the captured image
        onCapture(finalBlob, dataUrl, file);
      },
      'image/jpeg',
      0.95
    );
  };

  // Section 1: Only request permission when component mounts (after user clicked "Open Camera")
  useEffect(() => {
    isMountedRef.current = true;
    startCameraStream();

    // Section 9: Stop camera stream when component unmounts or user leaves
    return () => {
      isMountedRef.current = false;
      stopCameraStream();
    };
  }, [startCameraStream, stopCameraStream]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      {/* Hidden canvas for capturing exact frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for native mobile camera fallback */}
      <input
        id="camera-scanner-phone-fallback-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const url = event.target?.result as string;
              if (url) {
                stopCameraStream();
                onCapture(file, url, file);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />

      {/* Hidden file input for choose image fallback */}
      <input
        id="camera-scanner-choose-image-input"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const url = event.target?.result as string;
              if (url) {
                stopCameraStream();
                onCapture(file, url, file);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />

      {/* Modal Viewfinder Card */}
      <div className="relative w-full max-w-3xl bg-slate-900/90 border border-cyan-500/30 rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.2)] backdrop-blur-2xl text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              LIVE OCR CAMERA VIEWFINDER
            </span>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            title="Close Viewfinder"
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* STATUS: ERROR / PERMISSION DENIED */}
        {/* ======================================================== */}
        {status === 'error' && (
          <div className="p-6 sm:p-10 bg-slate-900/90 flex flex-col items-center justify-center text-center space-y-6 min-h-[380px]">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Please allow camera access to scan physical pages.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                {errorMessage || 'Camera access was blocked or not detected. You can adjust your browser permissions or use phone camera upload.'}
              </p>
            </div>

            {/* Step-by-step permission instructions popup */}
            {showSettingsHelp && (
              <div className="w-full max-w-md p-4 rounded-2xl bg-slate-800/90 border border-amber-500/30 text-left text-xs space-y-2 shadow-xl animate-in fade-in">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>How to allow camera access:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>Look at your browser's address bar at the top of the window.</li>
                  <li>Click the camera icon 📷 or padlock icon 🔒 next to the web address.</li>
                  <li>Change Camera permission from "Block" to <strong>"Allow"</strong>.</li>
                  <li>Click <strong>Try Again</strong> below.</li>
                </ol>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => startCameraStream()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs cursor-pointer shadow-lg flex items-center gap-1.5 active:scale-98 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              {errorType === 'permission' && (
                <button
                  onClick={() => setShowSettingsHelp(!showSettingsHelp)}
                  className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-slate-800 text-amber-300 font-extrabold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 hover:bg-slate-700 active:scale-98 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Camera Instructions</span>
                </button>
              )}

              <label
                htmlFor="camera-scanner-phone-fallback-input"
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-cyan-300 font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5 active:scale-98 transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Use Phone Camera</span>
              </label>

              <label
                htmlFor="camera-scanner-choose-image-input"
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5 hover:bg-slate-700 active:scale-98 transition-all"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Choose Image</span>
              </label>

              <button
                onClick={() => {
                  stopCameraStream();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATUS: INITIALIZING / STREAMING */}
        {/* ======================================================== */}
        {status !== 'error' && (
          <div className="relative aspect-4/3 sm:aspect-video bg-black flex items-center justify-center overflow-hidden">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Shutter Flash Animation */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150 pointer-events-none" />
            )}

            {/* CAMERA VIEWFINDER OVERLAY */}
            <div className="absolute inset-4 sm:inset-8 border border-white/10 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-inner overflow-hidden">
              {/* 4 Glowing Corner Target Brackets */}
              <div className="absolute top-2 left-2 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <div className="absolute top-2 right-2 w-8 sm:w-12 h-8 sm:h-12 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <div className="absolute bottom-2 left-2 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <div className="absolute bottom-2 right-2 w-8 sm:w-12 h-8 sm:h-12 border-b-4 border-r-4 border-cyan-400 rounded-br-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />

              {/* Laser Scanning Line Animation */}
              <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#22d3ee] animate-scanline pointer-events-none z-20" />

              {/* Alignment Hint Box */}
              <div className="self-center bg-slate-950/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-cyan-500/30 shadow-lg text-center pointer-events-auto">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-cyan-300">
                  ALIGN BOOK PAGE WITHIN FRAME
                </span>
              </div>

              {/* Center Book Framing Visual */}
              <div className="self-center flex flex-col items-center justify-center my-auto pointer-events-none">
                <div className="w-32 sm:w-48 h-36 sm:h-52 border-2 border-dashed border-cyan-400/40 rounded-2xl flex flex-col items-center justify-center p-3 text-cyan-200/80 bg-cyan-950/20 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    [ PHYSICAL PAGE ]
                  </span>
                  <span className="text-xs font-semibold mt-1 text-slate-300">Keep camera still</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between gap-4 z-30">
              {/* Flip Camera Button */}
              <button
                onClick={toggleCamera}
                title="Switch Camera"
                className="px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              {/* Floating Capture Shutter Button */}
              <button
                onClick={handleCapturePage}
                title="Capture Page & Process OCR"
                className="relative group p-1.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <div className="absolute -inset-1.5 rounded-full bg-cyan-400/30 animate-ping opacity-75 group-hover:opacity-100" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl border-2 border-white/50">
                  <Camera className="w-8 h-8 text-white drop-shadow-md" />
                </div>
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopCameraStream();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 backdrop-blur-md transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
