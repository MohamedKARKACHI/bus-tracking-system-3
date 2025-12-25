package com.bustracking.controller;

import com.bustracking.dto.request.MessageRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.entity.Message;
import com.bustracking.entity.User;
import com.bustracking.repository.UserRepository;
import com.bustracking.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des messages
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    /**
     * Récupérer les conversations de l'utilisateur connecté
     * GET /api/messages/conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<Message>>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        List<Message> messages = messageService.getUserMessages(user.getId());
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Récupérer les messages avec un utilisateur spécifique
     * GET /api/messages/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Message>>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        List<Message> messages = messageService.getConversation(user.getId(), userId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    /**
     * Envoyer un message
     * POST /api/messages
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Message>> sendMessage(
            @Valid @RequestBody MessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            Message message = messageService.sendMessage(user.getId(), request);
            return ResponseEntity.ok(ApiResponse.success("Message envoyé", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Marquer un message comme lu
     * PATCH /api/messages/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ResponseEntity.ok(ApiResponse.success("Message marqué comme lu", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Compter les messages non lus
     * GET /api/messages/unread/count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> countUnreadMessages(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        long count = messageService.countUnreadMessages(user.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}
