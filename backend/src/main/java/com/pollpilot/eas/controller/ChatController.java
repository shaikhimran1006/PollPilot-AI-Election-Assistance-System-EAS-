package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.ChatRequest;
import com.pollpilot.eas.service.ChatbotService;
import com.pollpilot.eas.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatbotService chatbotService;
    private final CurrentUserService currentUserService;

    public ChatController(ChatbotService chatbotService, CurrentUserService currentUserService) {
        this.chatbotService = chatbotService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<String> message(@Valid @RequestBody ChatRequest request) throws Exception {
        return ResponseEntity.ok(chatbotService.sendMessage(currentUserService.getUserId(), request.getMessage()));
    }
}
