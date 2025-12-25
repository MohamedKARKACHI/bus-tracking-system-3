package com.bustracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO pour l'envoi d'un message
 */
@Data
public class MessageRequest {
    
    @NotNull(message = "L'ID du destinataire est obligatoire")
    private Long receiverId;
    
    @NotBlank(message = "Le message est obligatoire")
    private String message;
}
