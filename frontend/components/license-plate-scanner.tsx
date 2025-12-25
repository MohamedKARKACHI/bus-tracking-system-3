"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    startServerCamera,
    stopServerCamera,
    getCameraStatus,
    savePlateDetection,
    detectLicensePlate,
    listCameras,
    DetectionResponse
} from '@/lib/api-anpr';
import ResultDisplay from './result-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, StopCircle, Upload, ArrowRightFromLine, ArrowLeftFromLine } from 'lucide-react';
import { toast } from 'sonner';

const LicensePlateScanner = () => {
    const [isCameraRunning, setIsCameraRunning] = useState(false);
    const [result, setResult] = useState<DetectionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'camera' | 'upload'>('camera');
    const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
    const [bbox, setBbox] = useState<[number, number, number, number] | null>(null);
    const [availableCameras, setAvailableCameras] = useState<Array<{ index: number; status: string; label: string }>>([]);
    const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    // Use localhost:5001 directly for the MJPEG stream from the Python service
    const videoUrl = "http://localhost:8001/video_feed";

    useEffect(() => {
        // Check initial status
        checkStatus();
        fetchCameras();

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
            // Optional: Stop camera on unmount? Better to keep running if user navigates away?
            // Let's stop it for now to save resources
            // stopServerCamera();
        };
    }, []);

    const checkStatus = async () => {
        const status = await getCameraStatus();
        setIsCameraRunning(status.running);

        if (status.running) {
            startPolling();
        }
    };

    const fetchCameras = async () => {
        const response = await listCameras();
        if (response.cameras && response.cameras.length > 0) {
            setAvailableCameras(response.cameras);
            // Default to first active if index 0 is black
            const firstActive = response.cameras.find(c => c.status === 'active');
            if (firstActive) {
                setSelectedCameraIndex(firstActive.index);
            }
        }
    };

    const startPolling = () => {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

        checkIntervalRef.current = setInterval(async () => {
            const status = await getCameraStatus();
            setIsCameraRunning(status.running);

            if (status.last_detection) {
                // Only update if it's a new detection (simple timestamp check)
                const detectionTimestamp = new Date(status.last_detection.timestamp || Date.now()).getTime();

                // Allow update if detection is newer than the last one we processed
                if (detectionTimestamp > lastDetectionTime) {
                    setResult(status.last_detection);
                    setLastDetectionTime(detectionTimestamp);
                }

                // Always update bbox if available for smooth tracking
                if (status.last_detection.bbox) {
                    setBbox(status.last_detection.bbox);
                } else {
                    setBbox(null);
                }
            } else {
                // No detection from server
                setBbox(null);

                // More aggressive auto-clear (1.5 seconds)
                if (result) {
                    const timer = setTimeout(() => {
                        setResult(null);
                    }, 1500);
                    return () => clearTimeout(timer);
                }
            }

            if (!status.running) {
                stopPolling();
            }
        }, 1000); // Poll every second
    };

    const stopPolling = () => {
        if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
        }
    };

    const handleStartCamera = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await startServerCamera(selectedCameraIndex);
            setIsCameraRunning(true);
            startPolling();
        } catch (err) {
            setError("Failed to start server camera. Make sure the Python service is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopCamera = async () => {
        setIsLoading(true);
        try {
            await stopServerCamera();
            setResult(null);
            setBbox(null);
            setLastDetectionTime(0);
            setIsCameraRunning(false);
            stopPolling();
        } catch (err) {
            setError("Failed to stop camera.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const response = await detectLicensePlate(base64String);

                if (response.success) {
                    setResult(response);
                    toast.success("Plate detected successfully!");
                } else {
                    setError(response.error || "No plate detected.");
                }
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Error processing file.");
            setIsLoading(false);
        }
    };

    const handleAction = async (type: 'CHECK_IN' | 'CHECK_OUT') => {
        if (!result) return;

        const success = await savePlateDetection(result, type);

        if (success) {
            toast.success(`${type === 'CHECK_IN' ? 'Check-in' : 'Check-out'} recorded for ${result.fullResult || result.plate_text}`);
            // Optional: auto-clear after successful action
            setResult(null);
        } else {
            toast.error(`Failed to record ${type.toLowerCase()}. Check backend connection.`);
        }
    };

    const handleClear = () => {
        setResult(null);
        setBbox(null);
        setLastDetectionTime(0);
        toast.info("Result cleared manually.");
    };

    return (
        <div className="scanner-container w-full max-w-4xl mx-auto">
            <Card className="w-full shadow-lg border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                    <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                        🚗 ANPR Access Control
                    </CardTitle>
                    <CardDescription className="text-center">
                        Automatic Check-in/Check-out System
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* Left Side: Camera/Upload */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-black/5 rounded-lg p-1 flex gap-2 mb-2">
                                <Button
                                    variant={mode === 'camera' ? 'default' : 'ghost'}
                                    className="flex-1"
                                    onClick={() => setMode('camera')}
                                >
                                    <Camera className="w-4 h-4 mr-2" /> Live Camera
                                </Button>
                                <Button
                                    variant={mode === 'upload' ? 'default' : 'ghost'}
                                    className="flex-1"
                                    onClick={() => setMode('upload')}
                                >
                                    <Upload className="w-4 h-4 mr-2" /> Upload Image
                                </Button>
                            </div>

                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner group">
                                {mode === 'camera' ? (
                                    isCameraRunning ? (
                                        <>
                                            <div
                                                ref={containerRef}
                                                className="relative w-full h-full"
                                            >
                                                <img
                                                    src={`${videoUrl}?t=${Date.now()}`}
                                                    alt="Camera Stream"
                                                    className="w-full h-full object-cover"
                                                    onLoad={() => console.log("Stream loaded")}
                                                    onError={(e) => {
                                                        setError("Lost connection to camera stream.");
                                                        setIsCameraRunning(false);
                                                    }}
                                                />

                                                {/* Green Rectangle Overlay */}
                                                {bbox && isCameraRunning && (
                                                    <div
                                                        className="absolute border-2 border-green-500 rounded-sm pointer-events-none transition-all duration-150 ease-out z-20"
                                                        style={{
                                                            left: `${(bbox[0] / 640) * 100}%`,
                                                            top: `${(bbox[1] / 480) * 100}%`,
                                                            width: `${((bbox[2] - bbox[0]) / 640) * 100}%`,
                                                            height: `${((bbox[3] - bbox[1]) / 480) * 100}%`,
                                                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                                                            backgroundColor: 'rgba(34, 197, 94, 0.1)'
                                                        }}
                                                    >
                                                        <div className="absolute -top-6 left-0 bg-green-500 text-black text-[10px] font-bold px-1 py-0.5 rounded uppercase">
                                                            Plate Detected
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-white/50 p-6">
                                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                            <p>Camera is offline</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:bg-white/5 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                        <Upload className="w-16 h-16 mx-auto mb-4 text-white/50" />
                                        <p className="text-white/70 font-medium">Click or Drag to Upload Image</p>
                                        <p className="text-white/40 text-sm mt-2">Supports JPG, PNG</p>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    </div>
                                )}
                            </div>

                            {mode === 'camera' && (
                                <div className="flex flex-col gap-3">
                                    {availableCameras.length > 0 && (
                                        <div className="flex flex-col gap-2 bg-secondary/20 p-3 rounded-lg border border-border/50">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                    <Camera className="w-3 h-3" /> Camera Source
                                                </label>
                                                {!isCameraRunning && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10px]"
                                                        onClick={fetchCameras}
                                                        disabled={isLoading}
                                                    >
                                                        Refresh List
                                                    </Button>
                                                )}
                                            </div>
                                            <select
                                                className="w-full p-2 rounded-md border border-input bg-background text-sm"
                                                value={selectedCameraIndex}
                                                onChange={(e) => setSelectedCameraIndex(parseInt(e.target.value))}
                                                disabled={isLoading || isCameraRunning}
                                            >
                                                {availableCameras.map(cam => (
                                                    <option key={cam.index} value={cam.index}>
                                                        {cam.label} {cam.status === 'black_screen' ? '(⚠️ Black Screen Detected)' : '(✅ Active)'}
                                                    </option>
                                                ))}
                                            </select>
                                            {isCameraRunning && (
                                                <p className="text-[10px] text-blue-500 font-medium">
                                                    Stop system to change camera source
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {!isCameraRunning ? (
                                        <Button
                                            onClick={handleStartCamera}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            size="lg"
                                            disabled={isLoading}
                                        >
                                            <Camera className="w-4 h-4 mr-2" /> Start System
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleStopCamera}
                                            variant="destructive"
                                            className="w-full"
                                            size="lg"
                                            disabled={isLoading}
                                        >
                                            <StopCircle className="w-4 h-4 mr-2" /> Stop System
                                        </Button>
                                    )}
                                </div>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Right Side: Results & Actions */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex-1 bg-secondary/10 rounded-xl p-4 border border-border/50 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <ScanLine className="w-5 h-5 text-primary" /> Detection Results
                                    </h3>
                                    {result && (
                                        <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 text-xs text-muted-foreground hover:text-destructive">
                                            Reset
                                        </Button>
                                    )}
                                </div>

                                <ResultDisplay result={result} />

                                {!result && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-sm italic py-10">
                                        {bbox ? (
                                            <div className="flex flex-col items-center gap-2 animate-pulse">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                <p className="text-blue-500 font-medium">Stabilizing detection...</p>
                                            </div>
                                        ) : (
                                            "Waiting for vehicle detection..."
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 h-14"
                                    onClick={() => handleAction('CHECK_IN')}
                                    disabled={!result}
                                >
                                    <ArrowRightFromLine className="w-5 h-5 mr-2" /> Check-in
                                </Button>
                                <Button
                                    size="lg"
                                    className="bg-orange-600 hover:bg-orange-700 h-14"
                                    onClick={() => handleAction('CHECK_OUT')}
                                    disabled={!result}
                                >
                                    <ArrowLeftFromLine className="w-5 h-5 mr-2" /> Check-out
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Missing icon import (adding manual fallback if lucide icons missing)
const ScanLine = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <line x1="7" x2="17" y1="8" y2="8" />
        <line x1="7" x2="17" y1="12" y2="12" />
        <line x1="7" x2="17" y1="16" y2="16" />
    </svg>
);

export default LicensePlateScanner;
