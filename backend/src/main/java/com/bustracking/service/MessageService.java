package com.bustracking.service;

import com.bustracking.dto.request.MessageRequest;
import com.bustracking.entity.Message;
import com.bustracking.entity.User;
import com.bustracking.repository.MessageRepository;
import com.bustracking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service de gestion des messages
 */
@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Récupérer les messages d'un utilisateur
     */
    public List<Message> getUserMessages(Long userId) {
        return messageRepository.findByUserId(userId);
    }

    /**
     * Récupérer la conversation entre deux utilisateurs
     */
    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    /**
     * Envoyer un message
     */
    @Transactional
    public Message sendMessage(Long senderId, MessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Expéditeur non trouvé"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Destinataire non trouvé"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .message(request.getMessage())
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        // Envoyer le message en temps réel via WebSocket
        messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), message);

        return message;
    }

    /**
     * Marquer un message comme lu
     */
    @Transactional
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message non trouvé"));
        message.setIsRead(true);
        messageRepository.save(message);
    }

    /**
     * Compter les messages non lus
     */
    public long countUnreadMessages(Long userId) {
        return messageRepository.countUnreadByReceiverId(userId);
    }
}
