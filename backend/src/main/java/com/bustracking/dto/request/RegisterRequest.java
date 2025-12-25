package com.bustracking.dto.request;

import com.bustracking.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO pour la requête d'inscription
 */
@Data
public class RegisterRequest {
    
    @NotBlank(message = "Le nom est obligatoire")
    private String name;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
    
    private String phone;
    
    private User.Role role = User.Role.client;
}
