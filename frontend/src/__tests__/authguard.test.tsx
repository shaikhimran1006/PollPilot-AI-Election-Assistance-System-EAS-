import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import AuthGuard from "../components/AuthGuard";

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <div>Protected Content</div>
            </AuthGuard>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AuthGuard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to login when no token exists", () => {
    renderWithRoutes();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children when token exists", () => {
    localStorage.setItem("accessToken", "test-token");
    renderWithRoutes();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
