import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

jest.mock('./Sharedcomponents/Sidebar', () => ({
  Sidebar: () => <nav data-testid="sidebar" role="navigation" className="sidebar">Sidebar</nav>,
}));

jest.mock('./ViewMatched', () => () => (
  <div data-testid="view-matched" className="main-content">
    ViewMatched Component
  </div>
));

describe('App Component', () => {
  const renderWithRouter = (route = '/matched') => {
    window.history.pushState({}, 'Test page', route);
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  test('renders Sidebar and ViewMatched component on /matched route', () => {
    renderWithRouter('/matched');

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('view-matched')).toBeInTheDocument();
  });

  test('redirects from "/" to "/matched" and renders ViewMatched', () => {
    renderWithRouter('/');

    expect(screen.getByTestId('view-matched')).toBeInTheDocument();
  });

  test('applies app-layout and main-content classes correctly', () => {
    renderWithRouter('/matched');

    const sidebar = screen.getByTestId('sidebar');
    const appLayout = sidebar.closest('.app-layout');
    expect(appLayout).toBeInTheDocument();

    const viewMatched = screen.getByTestId('view-matched');
    const mainContent = viewMatched.closest('.main-content');
    expect(mainContent).toBeInTheDocument();
  });

  test('renders Sidebar inside Router with role navigation', () => {
    renderWithRouter('/matched');

    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toBeInTheDocument();
  });
});