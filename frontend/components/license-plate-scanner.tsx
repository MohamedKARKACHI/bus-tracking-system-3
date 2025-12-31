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
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Camera, StopCircle, Upload, ArrowRightFromLine, ArrowLeftFromLine, ScanLine, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const LicensePlateScanner = () => {
    const [isCameraRunning, setIsCameraRunning] = useState(false);
    const [result, setResult] = useState<DetectionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'camera' | 'upload'>('camera');
    const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
    const [bbox, setBbox] = useState<[number, number, number, number] | null>(null);
    const [availableCameras, setAvailableCameras] = useState<Array<{ index: number; status: string; label: string }>>([]);
    const [selectedCameraIndex, setSelectedCameraIndex] = useState<string>("0");
    const containerRef = useRef<HTMLDivElement>(null);

    const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const videoUrl = "http://localhost:8001/video_feed";

    useEffect(() => {
        checkStatus();
        fetchCameras();

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
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
            const firstActive = response.cameras.find(c => c.status === 'active');
            if (firstActive) {
                setSelectedCameraIndex(firstActive.index.toString());
            }
        }
    };

    const startPolling = () => {
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

        checkIntervalRef.current = setInterval(async () => {
            const status = await getCameraStatus();
            setIsCameraRunning(status.running);

            if (status.last_detection) {
                const detectionTimestamp = new Date(status.last_detection.timestamp || Date.now()).getTime();

                if (detectionTimestamp > lastDetectionTime) {
                    setResult(status.last_detection);
                    setLastDetectionTime(detectionTimestamp);
                }

                if (status.last_detection.bbox) {
                    setBbox(status.last_detection.bbox);
                } else {
                    setBbox(null);
                }
            } else {
                setBbox(null);
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
        }, 1000);
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
            await startServerCamera(parseInt(selectedCameraIndex));
            setIsCameraRunning(true);
            startPolling();
        } catch (err) {
            setError("Failed to start server camera. Check Python service.");
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
            setResult(null);
        } else {
            toast.error(`Failed to record ${type.toLowerCase()}.`);
        }
    };

    const handleClear = () => {
        setResult(null);
        setBbox(null);
        setLastDetectionTime(0);
        toast.info("Result cleared manually.");
    };

    return (
        <Card className="h-full flex flex-col shadow-sm border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 flex flex-col h-full gap-6">

                {/* Control Bar */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex bg-white dark:bg-slate-950 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                        <Button
                            variant={mode === 'camera' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setMode('camera')}
                            className="text-xs"
                        >
                            <Camera className="w-3.5 h-3.5 mr-2" /> Live Camera
                        </Button>
                        <Button
                            variant={mode === 'upload' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setMode('upload')}
                            className="text-xs"
                        >
                            <Upload className="w-3.5 h-3.5 mr-2" /> Upload
                        </Button>
                    </div>

                    {mode === 'camera' && (
                        <div className="flex items-center gap-2">
                            {availableCameras.length > 0 && (
                                <Select value={selectedCameraIndex} onValueChange={setSelectedCameraIndex} disabled={isCameraRunning}>
                                    <SelectTrigger className="w-[180px] h-8 text-xs">
                                        <SelectValue placeholder="Camera Source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCameras.map(cam => (
                                            <SelectItem key={cam.index} value={cam.index.toString()}>
                                                {cam.label} {cam.status === 'black_screen' ? '⚠️' : '✅'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {!isCameraRunning ? (
                                <Button size="sm" onClick={handleStartCamera} className="h-8 bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                                    <Camera className="w-3.5 h-3.5 mr-2" /> Start
                                </Button>
                            ) : (
                                <Button size="sm" onClick={handleStopCamera} variant="destructive" className="h-8" disabled={isLoading}>
                                    <StopCircle className="w-3.5 h-3.5 mr-2" /> Stop
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content Area: Split View inside the card */}
                <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-0">

                    {/* Camera Feed Area */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner group min-h-[400px]">
                        {mode === 'camera' ? (
                            isCameraRunning ? (
                                <>
                                    <div ref={containerRef} className="relative w-full h-full">
                                        <img
                                            src={`${videoUrl}?t=${Date.now()}`}
                                            alt="Camera Stream"
                                            className="w-full h-full object-contain bg-black"
                                            onLoad={(e) => {
                                                console.log("Stream loaded", e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
                                                // Store natural dimensions in data attributes for easy access or state if needed
                                                e.currentTarget.setAttribute('data-natural-width', e.currentTarget.naturalWidth.toString());
                                                e.currentTarget.setAttribute('data-natural-height', e.currentTarget.naturalHeight.toString());
                                            }}
                                            onError={() => {
                                                setError("Lost signal from camera stream.");
                                                setIsCameraRunning(false);
                                            }}
                                        />
                                        {bbox && (() => {
                                            const img = containerRef.current?.querySelector('img');
                                            const nw = img ? parseInt(img.getAttribute('data-natural-width') || "640") : 640;
                                            const nh = img ? parseInt(img.getAttribute('data-natural-height') || "480") : 480;

                                            // Handle case where dimensions aren't loaded yet
                                            if (nw === 0 || nh === 0) return null;

                                            return (
                                                <div
                                                    className="absolute border-2 border-green-500 z-20 transition-all duration-150 ease-out"
                                                    style={{
                                                        left: `${(bbox[0] / nw) * 100}%`,
                                                        top: `${(bbox[1] / nh) * 100}%`,
                                                        width: `${((bbox[2] - bbox[0]) / nw) * 100}%`,
                                                        height: `${((bbox[3] - bbox[1]) / nh) * 100}%`,
                                                        boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.2)'
                                                    }}
                                                >
                                                    <div className="absolute -top-7 left-0 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                                        LICENSE PLATE {result?.confidence ? `${Math.round(result.confidence * 100)}%` : ''}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge variant="destructive" className="animate-pulse shadow-lg">LIVE FEED</Badge>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-slate-500 p-6 flex flex-col items-center">
                                    <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                                        <Camera className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="font-medium">Camera Offline</p>
                                    <p className="text-sm opacity-60 mt-1">Start the system to begin scanning</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer relative group-hover:border-primary/50">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-primary" />
                                </div>
                                <p className="text-slate-300 font-medium group-hover:text-white">Upload Image</p>
                                <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Processing...</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 z-50">
                                <Alert variant="destructive" className="shadow-lg border-red-500/50 bg-red-950/90 text-red-200">
                                    <AlertTitle>System Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Actions Panel */}
                    <div className="w-full xl:w-80 flex flex-col gap-4 flex-shrink-0">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <ScanLine className="w-4 h-4 text-primary" />
                                    Current Detection
                                </h3>
                                {result && (
                                    <button onClick={handleClear} className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1">
                                        <RefreshCw className="w-3 h-3" /> Reset
                                    </button>
                                )}
                            </div>

                            <div className="flex-1">
                                <ResultDisplay result={result} />

                                {!result && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4 min-h-[150px]">
                                        {bbox ? (
                                            <div className="flex flex-col items-center gap-3 animate-pulse">
                                                <div className="p-3 bg-blue-500/10 rounded-full">
                                                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                </div>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Analyzing License Plate...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-40">
                                                <ScanLine className="w-12 h-12" />
                                                <p className="text-sm font-medium">Waiting for vehicle...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                size="lg"
                                className="h-16 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex flex-col gap-1"
                                onClick={() => handleAction('CHECK_IN')}
                                disabled={!result}
                            >
                                <ArrowRightFromLine className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wide">Check-in</span>
                            </Button>
                            <Button
                                size="lg"
                                className="h-16 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 flex flex-col gap-1"
                                onClick={() => handleAction('CHECK_OUT')}
                                disabled={!result}
                            >
                                <ArrowLeftFromLine className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wide">Check-out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LicensePlateScanner;
