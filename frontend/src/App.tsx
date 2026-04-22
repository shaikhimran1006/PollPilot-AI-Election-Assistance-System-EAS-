import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import JourneyPage from "./pages/JourneyPage";
import TimelinePage from "./pages/TimelinePage";
import DocumentsPage from "./pages/DocumentsPage";
import LocatorPage from "./pages/LocatorPage";
import ChatbotPage from "./pages/ChatbotPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}
        children={[
          <Route index element={<DashboardPage />} key="dashboard" />,
          <Route path="journey" element={<JourneyPage />} key="journey" />,
          <Route path="timeline" element={<TimelinePage />} key="timeline" />,
          <Route path="documents" element={<DocumentsPage />} key="documents" />,
          <Route path="locator" element={<LocatorPage />} key="locator" />,
          <Route path="chatbot" element={<ChatbotPage />} key="chatbot" />,
          <Route path="admin" element={<AdminPage />} key="admin" />
        ]}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
