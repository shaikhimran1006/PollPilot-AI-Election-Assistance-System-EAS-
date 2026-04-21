package com.pollpilot.eas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "voter_profiles")
public class VoterProfile {
    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private boolean firstTimeVoter;

    @Column(nullable = false)
    private String preferredLanguage;

    @Column(nullable = false)
    private Instant createdAt;

    public VoterProfile() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isFirstTimeVoter() {
        return firstTimeVoter;
    }

    public void setFirstTimeVoter(boolean firstTimeVoter) {
        this.firstTimeVoter = firstTimeVoter;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
