
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Sharedcomponents/Sidebar', () => ({
  Sidebar: () => <nav data-testid="sidebar">Sidebar</nav>,
}));
jest.mock('./ViewMatched', () => () => (
  <div data-testid="view-matched">ViewMatched Component</div>
));

describe('App Component', () => {
  test('renders Sidebar and ViewMatched component on /matched route', () => {
    window.history.pushState({}, 'Test page', '/matched');
    render(<App />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('view-matched')).toBeInTheDocument();
  });

  test('redirects from "/" to "/matched" and renders ViewMatched', () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);

    expect(screen.getByTestId('view-matched')).toBeInTheDocument();
  });

  test('app-layout and main-content classes are applied correctly', () => {
    window.history.pushState({}, 'Test page', '/matched');
    render(<App />);

    const appLayout = screen.getByTestId('sidebar').closest('.app-layout');
    expect(appLayout).toBeInTheDocument();

    const mainContent = screen.getByTestId('view-matched').closest('.main-content');
    expect(mainContent).toBeInTheDocument();
  });


  test('renders Sidebar inside Router with role navigation', () => {
    window.history.pushState({}, 'Test page', '/matched');
    render(<App />);

    const sidebarElement = screen.getByRole('navigation');
    expect(sidebarElement).toBeInTheDocument();
  });
});