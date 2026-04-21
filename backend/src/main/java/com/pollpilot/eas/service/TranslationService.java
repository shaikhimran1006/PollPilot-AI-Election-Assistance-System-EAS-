package com.pollpilot.eas.service;

import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class TranslationService {
    private final Translate translate;

    public TranslationService(@Value("${google.translate.apiKey}") String apiKey) {
        this.translate = TranslateOptions.newBuilder().setApiKey(apiKey).build().getService();
    }

    @Cacheable(value = "translations", key = "#text + '-' + #target")
    public String translate(String text, String target) {
        Translation translation = translate.translate(text, Translate.TranslateOption.targetLanguage(target));
        return translation.getTranslatedText();
    }
}
