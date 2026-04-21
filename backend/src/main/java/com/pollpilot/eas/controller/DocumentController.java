package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.DocumentUpdateRequest;
import com.pollpilot.eas.model.DocumentChecklistItem;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.DocumentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;
    private final CurrentUserService currentUserService;

    public DocumentController(DocumentService documentService, CurrentUserService currentUserService) {
        this.documentService = documentService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentChecklistItem>> getChecklist() {
        return ResponseEntity.ok(documentService.getChecklist(currentUserService.getUserId()));
    }

    @PatchMapping
    public ResponseEntity<DocumentChecklistItem> update(@Valid @RequestBody DocumentUpdateRequest request) {
        return ResponseEntity.ok(documentService.updateStatus(currentUserService.getUserId(), request));
    }
}
