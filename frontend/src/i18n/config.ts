import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "dashboard.title": "Your Election Navigator",
      "journey.title": "Personalized Journey",
      "timeline.title": "Timeline & Reminders",
      "documents.title": "Document Checklist",
      "locator.title": "Polling Booth Locator",
      "chatbot.title": "Ask the AI Assistant"
    }
  },
  hi: {
    translation: {
      "dashboard.title": "आपका चुनाव मार्गदर्शक",
      "journey.title": "व्यक्तिगत यात्रा",
      "timeline.title": "समयरेखा और अनुस्मारक",
      "documents.title": "दस्तावेज़ चेकलिस्ट",
      "locator.title": "मतदान केंद्र खोजें",
      "chatbot.title": "एआई सहायक से पूछें"
    }
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
