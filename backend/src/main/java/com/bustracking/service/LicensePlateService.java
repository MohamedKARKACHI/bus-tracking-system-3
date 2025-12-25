package com.bustracking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bustracking.model.PlateDetectionRequest;
import com.bustracking.model.PlateDetectionResponse;
import com.bustracking.dto.PlateDetectionDTO;
import com.bustracking.entity.PlateDetection;
import com.bustracking.repository.PlateDetectionRepository;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class LicensePlateService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    @Autowired
    private PlateDetectionRepository plateDetectionRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public PlateDetectionResponse detectPlate(PlateDetectionRequest request) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // Prepare request to Python AI service
            HttpPost httpPost = new HttpPost(aiServiceUrl + "/detect/base64");

            String jsonRequest = objectMapper.writeValueAsString(request);
            StringEntity entity = new StringEntity(jsonRequest, ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-Type", "application/json");

            // Execute request
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                String responseBody = new String(
                        response.getEntity().getContent().readAllBytes(),
                        StandardCharsets.UTF_8);

                // Parse response
                JsonNode jsonResponse = objectMapper.readTree(responseBody);

                if (jsonResponse.has("success") && jsonResponse.get("success").asBoolean()) {
                    JsonNode detections = jsonResponse.get("detections");

                    if (detections != null && detections.isArray() && detections.size() > 0) {
                        JsonNode result = detections.get(0);

                        String serial = result.has("serial_number") ? result.get("serial_number").asText() : "";
                        String letter = result.has("arabic_letter") ? result.get("arabic_letter").asText() : "";
                        String region = result.has("region_code") ? result.get("region_code").asText() : "";
                        String fullResult = result.has("formatted") ? result.get("formatted").asText()
                                : (serial + " | " + letter + " | " + region);

                        Long timestamp = System.currentTimeMillis() / 1000;
                        if (result.has("timestamp")) {
                            try {
                                timestamp = result.get("timestamp").asLong();
                            } catch (Exception e) {
                                // Timestamp might be a string in Python, ignore if can't parse as long
                            }
                        }

                        return PlateDetectionResponse.builder()
                                .success(true)
                                .serial(serial)
                                .letter(letter)
                                .region(region)
                                .fullResult(fullResult)
                                .timestamp(timestamp)
                                .build();
                    } else {
                        return PlateDetectionResponse.builder()
                                .success(false)
                                .error("No plate detected in detections list")
                                .build();
                    }
                } else {
                    String errorMsg = jsonResponse.has("error") ? jsonResponse.get("error").asText()
                            : "AI service reported failure";
                    return PlateDetectionResponse.builder()
                            .success(false)
                            .error(errorMsg)
                            .build();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return PlateDetectionResponse.builder()
                    .success(false)
                    .error("Error communicating with AI service: " + e.getMessage())
                    .build();
        }
    }

    public boolean checkAiServiceHealth() {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(aiServiceUrl + "/health");
            try (CloseableHttpResponse response = httpClient.execute(httpGet)) {
                return response.getCode() == 200;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public void savePlateDetection(PlateDetectionDTO dto) {
        try {
            PlateDetection detection = PlateDetection.builder()
                    .plateNumber(dto.getPlateNumber() != null ? dto.getPlateNumber() : "UNKNOWN")
                    .serialNumber(dto.getSerialNumber())
                    .arabicLetter(dto.getArabicLetter())
                    .regionCode(dto.getRegionCode())
                    .eventType(PlateDetection.EventType.valueOf(dto.getEventType()))
                    .confidence(dto.getConfidence())
                    .build();

            plateDetectionRepository.save(detection);
        } catch (Exception e) {
            System.err.println("Error saving plate detection: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save plate detection: " + e.getMessage());
        }
    }

    public List<PlateDetection> getRecentDetections() {
        return plateDetectionRepository.findTop50ByOrderByTimestampDesc();
    }
}
