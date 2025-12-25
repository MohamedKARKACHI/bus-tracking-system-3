'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PlateDetection,
  detectFromBase64,
  detectFromFile,
  simulateEntry,
  simulateExit,
  checkServiceHealth,
  createDetectionWebSocket,
  getDetectionHistory,
} from '@/lib/anpr-service';

export interface UseANPROptions {
  autoConnect?: boolean;
  onDetection?: (detection: PlateDetection) => void;
}

export function useANPR(options: UseANPROptions = {}) {
  // Disable autoConnect by default to prevent WebSocket errors when service is not running
  const { autoConnect = false, onDetection } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [isServiceOnline, setIsServiceOnline] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetection, setLastDetection] = useState<PlateDetection | null>(null);
  const [detections, setDetections] = useState<PlateDetection[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);

  // Check service health
  const checkHealth = useCallback(async () => {
    const healthy = await checkServiceHealth();
    setIsServiceOnline(healthy);
    return healthy;
  }, []);

  // Connect to WebSocket (only when explicitly called or autoConnect is enabled)
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    // Only attempt WebSocket connection if service is online
    if (!isServiceOnline) {
      console.log('ANPR service offline, skipping WebSocket connection');
      return;
    }

    try {
      wsRef.current = createDetectionWebSocket(
        (detection) => {
          setLastDetection(detection);
          setDetections((prev) => [detection, ...prev].slice(0, 100));
          onDetection?.(detection);
        },
        () => {
          // Silently handle WebSocket errors - HTTP API still works
          setIsConnected(false);
        }
      );

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
      };
    } catch (e) {
      // Silently handle - the HTTP endpoints still work without WebSocket
      console.log('WebSocket connection skipped');
    }
  }, [onDetection, isServiceOnline]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Detect from base64 image
  const detectBase64 = useCallback(async (imageBase64: string, confidence = 0.5) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await detectFromBase64(imageBase64, confidence);
      
      if (response.detections.length > 0) {
        const detection = response.detections[0];
        setLastDetection(detection);
        setDetections((prev) => [detection, ...prev].slice(0, 100));
        onDetection?.(detection);
      }
      
      return response;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Detection failed';
      setError(message);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, [onDetection]);

  // Detect from file
  const detectFile = useCallback(async (file: File, confidence = 0.5) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await detectFromFile(file, confidence);
      
      if (response.detections.length > 0) {
        const detection = response.detections[0];
        setLastDetection(detection);
        setDetections((prev) => [detection, ...prev].slice(0, 100));
        onDetection?.(detection);
      }
      
      return response;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Detection failed';
      setError(message);
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, [onDetection]);

  // Send frame through WebSocket
  const sendFrame = useCallback((imageBase64: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(`frame:${imageBase64}`);
    }
  }, []);

  // Simulate entry
  const triggerEntry = useCallback(async () => {
    setIsProcessing(true);
    try {
      const result = await simulateEntry();
      if (result.detection) {
        setLastDetection(result.detection);
        setDetections((prev) => [result.detection, ...prev].slice(0, 100));
        onDetection?.(result.detection);
      }
      return result;
    } catch (e) {
      setError('Failed to simulate entry');
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, [onDetection]);

  // Simulate exit
  const triggerExit = useCallback(async () => {
    setIsProcessing(true);
    try {
      const result = await simulateExit();
      if (result.detection) {
        setLastDetection(result.detection);
        setDetections((prev) => [result.detection, ...prev].slice(0, 100));
        onDetection?.(result.detection);
      }
      return result;
    } catch (e) {
      setError('Failed to simulate exit');
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, [onDetection]);

  // Load history
  const loadHistory = useCallback(async (limit = 50) => {
    try {
      const history = await getDetectionHistory(limit);
      setDetections(history.detections);
      return history;
    } catch (e) {
      setError('Failed to load history');
      throw e;
    }
  }, []);

  // Clear detections
  const clearDetections = useCallback(() => {
    setDetections([]);
    setLastDetection(null);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    checkHealth();
    
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, checkHealth, connect, disconnect]);

  // Reconnect on service online
  useEffect(() => {
    if (isServiceOnline && autoConnect && !isConnected) {
      connect();
    }
  }, [isServiceOnline, autoConnect, isConnected, connect]);

  return {
    // State
    isConnected,
    isServiceOnline,
    isProcessing,
    lastDetection,
    detections,
    error,
    
    // Actions
    connect,
    disconnect,
    checkHealth,
    detectBase64,
    detectFile,
    sendFrame,
    triggerEntry,
    triggerExit,
    loadHistory,
    clearDetections,
  };
}
