import axios from 'axios';

// Direct connection to Python ANPR service (bypassing Java backend due to build issues)
const API_BASE_URL = 'http://localhost:8001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

export interface PlateResult {
    serial: string;
    letter: string;
    region: string;
    fullResult: string;
    timestamp: number;
}

export interface DetectionResponse {
    success: boolean;
    serial?: string;
    letter?: string;
    region?: string;
    fullResult?: string;
    timestamp?: number;
    processedImage?: string;
    error?: string;
    // Python service fields
    plate_text?: string;
    formatted?: string;
    confidence?: number;
}

export interface HealthResponse {
    status: string;
    aiServiceAvailable?: boolean;
    message?: string;
}

export const detectLicensePlate = async (imageBase64: string): Promise<DetectionResponse> => {
    try {
        // Python service expects the image in base64 format
        // Remove data URL prefix if present
        const base64Data = imageBase64.includes(',')
            ? imageBase64.split(',')[1]
            : imageBase64;

        const response = await api.post('/detect/base64', {
            image: base64Data,
        });

        // Map Python service response to our interface
        const data = response.data;
        const firstDetection = data.detections && data.detections.length > 0 ? data.detections[0] : null;

        return {
            success: data.success !== false && !!firstDetection,
            plate_text: firstDetection?.plate_text,
            formatted: firstDetection?.formatted,
            confidence: firstDetection?.confidence,
            serial: firstDetection?.serial_number,
            letter: firstDetection?.arabic_letter,
            region: firstDetection?.region_code,
            fullResult: firstDetection?.formatted || firstDetection?.plate_text,
            processedImage: data.processed_image,
        };
    } catch (error) {
        console.error('Error detecting license plate:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

export const checkHealth = async (): Promise<HealthResponse> => {
    try {
        const response = await api.get<HealthResponse>('/health');
        return {
            status: response.data.status || 'healthy',
            aiServiceAvailable: response.data.status === 'healthy',
            message: 'Python ANPR service is running',
        };
    } catch (error) {
        console.error('Error checking health:', error);
        return {
            status: 'offline',
            aiServiceAvailable: false,
            message: 'Failed to connect to ANPR service',
        };
    }
};

// Camera Control API
export const startServerCamera = async (index?: number): Promise<{ status: string; index?: number }> => {
    try {
        const response = await api.post('/camera/start', null, { params: { index } });
        return response.data;
    } catch (error) {
        console.error('Error starting camera:', error);
        throw error;
    }
};

export const listCameras = async (): Promise<{ cameras: Array<{ index: number; status: string; label: string }> }> => {
    try {
        const response = await api.get('/camera/list');
        return response.data;
    } catch (error) {
        console.error('Error listing cameras:', error);
        return { cameras: [] };
    }
};

export const stopServerCamera = async (): Promise<{ status: string }> => {
    try {
        const response = await api.post('/camera/stop');
        return response.data;
    } catch (error) {
        console.error('Error stopping camera:', error);
        return { status: 'error' };
    }
};

export const getCameraStatus = async (): Promise<{ running: boolean; last_detection?: any }> => {
    try {
        const response = await api.get('/camera/status');
        return response.data;
    } catch (error) {
        return { running: false };
    }
};

// Backend Integration (Java Spring Boot)
export const savePlateDetection = async (detection: DetectionResponse, type: 'CHECK_IN' | 'CHECK_OUT'): Promise<boolean> => {
    const BACKEND_URL = 'http://localhost:8080/api/license-plate';

    try {
        const endpoint = type === 'CHECK_IN' ? 'checkin' : 'checkout';
        await axios.post(`${BACKEND_URL}/${endpoint}`, {
            plateNumber: detection.fullResult || detection.plate_text || 'UNKNOWN',
            serialNumber: detection.serial || '?',
            arabicLetter: detection.letter || '?',
            regionCode: detection.region || '?',
            confidence: detection.confidence || 0,
            eventType: type,
        });
        return true;
    } catch (error) {
        console.error(`Error saving ${type} detection:`, error);
        return false;
    }
};

export default api;

