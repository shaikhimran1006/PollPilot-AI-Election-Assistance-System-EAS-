import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import LoginPage from "../pages/LoginPage";

const postMock = vi.fn();

vi.mock("../services/api", () => ({
  default: {
    post: postMock
  },
  isDemoMode: false
}));

vi.mock("../services/firebase", () => ({
  auth: {}
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn()
}));

describe("LoginPage", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("shows error message when login fails", async () => {
    postMock.mockRejectedValue({ response: { data: { message: "Bad credentials" } } });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Bad credentials")).toBeInTheDocument();
  });

  it("shows error message when signup fails", async () => {
    postMock.mockRejectedValue({ response: { data: { message: "Email already in use" } } });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));

    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
  });
});
