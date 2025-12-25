package com.bustracking.dto.request;

import com.bustracking.entity.User;
import jakarta.validation.constraints.Email;
import lombok.Data;

/**
 * DTO pour la mise à jour d'un utilisateur
 */
@Data
public class UserUpdateRequest {
    
    private String name;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    private String phone;
    
    private User.Role role;
    
    private String password;
}
