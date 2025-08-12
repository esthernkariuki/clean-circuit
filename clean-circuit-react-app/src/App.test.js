import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  test("renders Sidebar inside Router", () => {
    render(<App />);
    const sidebarElement = screen.getByRole("navigation");
    expect(sidebarElement).toBeInTheDocument();
  });
});
