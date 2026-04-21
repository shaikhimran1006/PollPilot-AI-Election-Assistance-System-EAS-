package com.pollpilot.eas.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class FirestoreService {
    public void upsertUserProgress(String userId, Map<String, Object> payload) {
        Firestore firestore = FirestoreClient.getFirestore();
        firestore.collection("journeyProgress").document(userId).set(payload);
    }
}
