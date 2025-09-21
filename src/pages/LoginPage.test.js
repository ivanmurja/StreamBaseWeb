import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";

jest.mock("../firebase/config", () => ({
  auth: {},
  db: {},
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue(true),
  }),
}));

jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe("LoginPage Component", () => {
  test("allows the user to type in email and password fields", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: "teste@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    expect(emailInput.value).toBe("teste@teste.com");
    expect(passwordInput.value).toBe("senha123");
  });
});
