package com.pollpilot.eas.service;

import com.pollpilot.eas.dto.DocumentUpdateRequest;
import com.pollpilot.eas.model.DocumentChecklistItem;
import com.pollpilot.eas.repository.DocumentChecklistRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {
    private final DocumentChecklistRepository documentChecklistRepository;

    public DocumentService(DocumentChecklistRepository documentChecklistRepository) {
        this.documentChecklistRepository = documentChecklistRepository;
    }

    public List<DocumentChecklistItem> getChecklist(String userId) {
        List<DocumentChecklistItem> existing = documentChecklistRepository.findByUserId(userId);
        if (!existing.isEmpty()) {
            return existing;
        }
        List<DocumentChecklistItem> seeded = new ArrayList<>();
        seeded.add(createChecklistItem(userId, "Government Photo ID"));
        seeded.add(createChecklistItem(userId, "Voter Slip / Registration Receipt"));
        seeded.add(createChecklistItem(userId, "Address Proof"));
        documentChecklistRepository.saveAll(seeded);
        return documentChecklistRepository.findByUserId(userId);
    }

    public DocumentChecklistItem updateStatus(String userId, DocumentUpdateRequest request) {
        DocumentChecklistItem item = documentChecklistRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        if (!item.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        item.setStatus(request.getStatus());
        item.setUpdatedAt(Instant.now());
        return documentChecklistRepository.save(item);
    }

    private DocumentChecklistItem createChecklistItem(String userId, String documentName) {
        DocumentChecklistItem item = new DocumentChecklistItem();
        item.setUserId(userId);
        item.setDocumentName(documentName);
        item.setStatus("pending");
        item.setUpdatedAt(Instant.now());
        return item;
    }
}
