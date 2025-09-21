import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("./firebase/config", () => ({
  initializeApp: jest.fn(() => ({})),
  getAuth: jest.fn(() => ({})),
  getFirestore: jest.fn(() => ({})),
  auth: {},
  db: {},
}));

jest.mock("axios", () => ({
  create: () => ({
    get: jest.fn(() =>
      Promise.resolve({ data: { genres: [{ id: 1, name: "Action" }] } })
    ),
  }),
}));

jest.mock("./context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "123", email: "test@test.com" } }),
}));

import App from "./App";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

test("renders main App content without crashing", async () => {
  render(<App />);
  const elements = screen.getAllByText(/StreamBase/i);
  expect(elements.length).toBeGreaterThan(0);
});
