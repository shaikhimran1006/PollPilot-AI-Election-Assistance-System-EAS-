package com.pollpilot.eas.dto;

import jakarta.validation.constraints.NotBlank;

public class PollingSearchRequest {
    @NotBlank
    private String address;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
