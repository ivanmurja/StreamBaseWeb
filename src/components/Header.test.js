// Header.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "123", displayName: "Test User" },
    logout: jest.fn().mockResolvedValue(true),
    unreadNotificationsCount: 2,
  }),
}));

jest.mock("./NotificationDropdown", () => () => (
  <div data-testid="notification-dropdown">Dropdown</div>
));

jest.mock(
  "./MobileSidebar",
  () =>
    ({ isOpen }) =>
      isOpen ? <div data-testid="mobile-sidebar">Sidebar</div> : null
);

describe("Header Component", () => {
  test("renders logo and title", () => {
    render(
      <MemoryRouter>
        <Header onFilterToggle={jest.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText(/StreamBase/i)).toBeInTheDocument();
  });

  test("renders notification button with count and toggles dropdown", () => {
    render(
      <MemoryRouter>
        <Header onFilterToggle={jest.fn()} />
      </MemoryRouter>
    );
    const bellButton = screen.getAllByTitle(/Notificações/i)[0];
    const notificationCount = screen.getAllByTestId("notification-count")[0];
    expect(notificationCount).toHaveTextContent("2");
    fireEvent.click(bellButton);
    expect(
      screen.getAllByTestId("notification-dropdown")[0]
    ).toBeInTheDocument();
  });

  test("renders profile button and opens profile menu", () => {
    render(
      <MemoryRouter>
        <Header onFilterToggle={jest.fn()} />
      </MemoryRouter>
    );
    const profileButton = screen.getAllByTitle(/Perfil/i)[0];
    fireEvent.click(profileButton);
    expect(screen.getByText(/Meu Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair/i)).toBeInTheDocument();
  });

  test("renders filter button and calls onFilterToggle", () => {
    const mockToggle = jest.fn();
    render(
      <MemoryRouter>
        <Header onFilterToggle={mockToggle} />
      </MemoryRouter>
    );
    const filterButtons = screen.getAllByTitle(/Filtros/i);
    fireEvent.click(filterButtons[0]);
    expect(mockToggle).toHaveBeenCalled();
  });
});
