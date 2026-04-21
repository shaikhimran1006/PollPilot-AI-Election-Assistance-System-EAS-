package com.pollpilot.eas.service;

import com.google.cloud.dialogflow.v2.DetectIntentRequest;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.TextInput;
import com.pollpilot.eas.model.ChatSession;
import com.pollpilot.eas.repository.ChatSessionRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {
    private final ChatSessionRepository chatSessionRepository;
    private final String projectId;
    private final InputSanitizer inputSanitizer;

    public ChatbotService(ChatSessionRepository chatSessionRepository,
                          @Value("${google.dialogflow.projectId}") String projectId,
                          InputSanitizer inputSanitizer) {
        this.chatSessionRepository = chatSessionRepository;
        this.projectId = projectId;
        this.inputSanitizer = inputSanitizer;
    }

    public String sendMessage(String userId, String message) throws Exception {
        String cleanMessage = inputSanitizer.sanitize(message);
        ChatSession session = chatSessionRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ChatSession created = new ChatSession();
                    created.setUserId(userId);
                    return chatSessionRepository.save(created);
                });

        String sessionId = session.getId() + "-" + UUID.randomUUID();
        try (SessionsClient sessionsClient = SessionsClient.create()) {
            SessionName sessionName = SessionName.of(projectId, sessionId);
            TextInput textInput = TextInput.newBuilder().setText(cleanMessage).setLanguageCode("en-US").build();
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
            DetectIntentRequest request = DetectIntentRequest.newBuilder()
                    .setSession(sessionName.toString())
                    .setQueryInput(queryInput)
                    .build();
            DetectIntentResponse response = sessionsClient.detectIntent(request);
            QueryResult result = response.getQueryResult();
            session.setLastIntent(result.getIntent().getDisplayName());
            chatSessionRepository.save(session);
            return result.getFulfillmentText();
        }
    }
}
