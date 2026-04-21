package com.pollpilot.eas.service;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class InputSanitizer {
    public String sanitize(String input) {
        if (input == null) {
            return "";
        }
        return HtmlUtils.htmlEscape(input.trim());
    }
}
