import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "./MovieCard";

jest.mock("axios", () => {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    create: jest.fn(() => mockAxios),
  };
  return mockAxios;
});

describe("MovieCard Component", () => {
  const mockMovie = {
    id: 1,
    poster: "/fake-poster.jpg",
    title: "Filme de Teste",
    year: "2024",
    rating: "8.5",
    mediaType: "movie",
    watched: true,
  };

  test("renders movie information correctly", () => {
    render(
      <MemoryRouter>
        <MovieCard {...mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.year)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.rating)).toBeInTheDocument();
    expect(screen.getByText("ASSISTIDO")).toBeInTheDocument();
  });
});
