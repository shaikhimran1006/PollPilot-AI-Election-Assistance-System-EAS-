package com.pollpilot.eas.dto;

import jakarta.validation.constraints.NotBlank;

public class DocumentUpdateRequest {
    @NotBlank
    private String documentId;

    @NotBlank
    private String status;

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
