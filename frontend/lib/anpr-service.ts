/**
 * ANPR Service API Client
 * For Moroccan License Plate Recognition
 */

const ANPR_SERVICE_URL = process.env.NEXT_PUBLIC_ANPR_URL || 'http://localhost:8001';

export interface PlateDetection {
  plate_text: string;
  serial_number: string;
  arabic_letter: string;
  region_code: string;
  confidence: number;
  bbox: number[];
  formatted: string;
  timestamp: string;
}

export interface DetectionResponse {
  success: boolean;
  detections: PlateDetection[];
  count: number;
  processing_time_ms: number;
}

export interface Camera {
  id: string;
  status: 'online' | 'offline';
  location: string;
  detections: number;
}

/**
 * Detect plates from a base64 encoded image
 */
export async function detectFromBase64(
  imageBase64: string,
  confidenceThreshold: number = 0.5
): Promise<DetectionResponse> {
  const response = await fetch(`${ANPR_SERVICE_URL}/detect/base64`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: imageBase64,
      confidence_threshold: confidenceThreshold,
    }),
  });

  if (!response.ok) {
    throw new Error(`Detection failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Detect plates from an uploaded file
 */
export async function detectFromFile(
  file: File,
  confidenceThreshold: number = 0.5
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${ANPR_SERVICE_URL}/detect/upload?confidence_threshold=${confidenceThreshold}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Detection failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get detection history
 */
export async function getDetectionHistory(limit: number = 50): Promise<{
  detections: PlateDetection[];
  total: number;
}> {
  const response = await fetch(`${ANPR_SERVICE_URL}/detections/history?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all cameras
 */
export async function getCameras(): Promise<{ cameras: Camera[] }> {
  const response = await fetch(`${ANPR_SERVICE_URL}/cameras`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cameras: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Simulate entry detection (for demo/testing)
 */
export async function simulateEntry(): Promise<{ success: boolean; detection: PlateDetection }> {
  const response = await fetch(`${ANPR_SERVICE_URL}/simulate/entry`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Simulation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Simulate exit detection (for demo/testing)
 */
export async function simulateExit(): Promise<{ success: boolean; detection: PlateDetection }> {
  const response = await fetch(`${ANPR_SERVICE_URL}/simulate/exit`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error(`Simulation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if ANPR service is running
 */
export async function checkServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ANPR_SERVICE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Create WebSocket connection for real-time detections
 */
export function createDetectionWebSocket(
  onDetection: (detection: PlateDetection) => void,
  onError?: (error: Event) => void
): WebSocket {
  const wsUrl = ANPR_SERVICE_URL.replace('http', 'ws') + '/ws/detections';
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'detection' || data.type === 'entry' || data.type === 'exit') {
      if (Array.isArray(data.data)) {
        data.data.forEach(onDetection);
      } else {
        onDetection(data.data);
      }
    }
  };

  ws.onerror = (error) => {
    // Silently handle WebSocket errors - HTTP API endpoints still work
    onError?.(error);
  };

  return ws;
}
