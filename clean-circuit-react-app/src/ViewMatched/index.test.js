import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ViewMatched from './index';
import * as useMatchModule from '../hooks/useMatch';
import * as navigationModule from '../utils/navigation';

jest.spyOn(useMatchModule, 'useMatch');
jest.mock('../utils/navigation', () => ({
  ...jest.requireActual('../utils/navigation'),
  fetchMaterials: jest.fn(),
}));

jest.mock('../Sharedcomponents/Sidebar', () => ({
  Sidebar: () => <div>Sidebar</div>,
}));

describe('ViewMatched Component', () => {
  const mockUseMatch = {
    selectedCloth: null,
    selectCloth: jest.fn(),
    clearSelection: jest.fn(),
    materials: [],
    setMaterials: jest.fn(),
    loading: false,
    setLoading: jest.fn(),
    error: null,
    setError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useMatchModule.useMatch.mockReturnValue(mockUseMatch);
  });

  test('renders paginated cloth grid with 6 items per page when no cloth selected', () => {
    render(<ViewMatched />);
    const clothCards = Array.from(screen.getAllByRole('button')).filter(
      el => el.classList.contains('cloth-card')
    );
    expect(clothCards.length).toBe(6);

    clothCards.forEach((card) => {
      const strongText = card.querySelector('strong');
      expect(strongText).toBeInTheDocument();
      expect(strongText.textContent).toBeTruthy();

      const img = card.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img.alt).toBe(strongText.textContent);
    });

    expect(screen.getByText(/Page \d+ of \d+/i)).toBeInTheDocument();
  });

  test('calls selectCloth when a cloth card is clicked', () => {
    render(<ViewMatched />);
    const clothCards = Array.from(screen.getAllByRole('button')).filter(
      el => el.classList.contains('cloth-card')
    );
    fireEvent.click(clothCards[0]);
    expect(mockUseMatch.selectCloth).toHaveBeenCalledWith(expect.any(String));
  });

  test('calls selectCloth when Enter key is pressed on a cloth card', () => {
    render(<ViewMatched />);
    const clothCards = Array.from(screen.getAllByRole('button')).filter(
      el => el.classList.contains('cloth-card')
    );
    fireEvent.keyDown(clothCards[0], { key: 'Enter' });
    expect(mockUseMatch.selectCloth).toHaveBeenCalledWith(expect.any(String));
  });

  test('renders materials view when a cloth is selected', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
      materials: [
        {
          type: 'Cotton',
          material: 'Soft Cotton',
          quantity: 10,
          condition: 'New',
          listed_at: '2023-10-01T00:00:00Z',
          trader: 'Trader A',
        },
      ],
    });

    render(<ViewMatched />);

    expect(screen.getByText('Materials for Cotton')).toBeInTheDocument();
    expect(screen.getByAltText('Cotton')).toBeInTheDocument();
    expect(screen.getByText('Soft Cotton')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText(/10\/1\/2023|1\/10\/2023/)).toBeInTheDocument();
    expect(screen.getByText('Trader A')).toBeInTheDocument();
  });

  test('renders loading state when fetching materials', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
      loading: true,
    });

    render(<ViewMatched />);
    expect(screen.getByText('Loading materials...')).toBeInTheDocument();
  });

  test('renders error state when fetch fails', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
      error: 'Failed to fetch materials',
    });

    render(<ViewMatched />);
    expect(screen.getByText('Failed to fetch materials')).toBeInTheDocument();
  });

  test('renders no materials message when materials array is empty', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
      materials: [],
    });

    render(<ViewMatched />);
    expect(screen.getByText('No materials found for this cloth type yet.')).toBeInTheDocument();
  });

  test('calls clearSelection when back icon is clicked', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
    });

    render(<ViewMatched />);
    const backIcon = screen.getByLabelText('Go back');
    fireEvent.click(backIcon);
    expect(mockUseMatch.clearSelection).toHaveBeenCalled();
  });

  test('calls clearSelection when Enter key is pressed on back icon', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
    });

    render(<ViewMatched />);
    const backIcon = screen.getByLabelText('Go back');
    fireEvent.keyDown(backIcon, { key: 'Enter' });
    expect(mockUseMatch.clearSelection).toHaveBeenCalled();
  });

  test('groups and sorts materials by type', () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
      materials: [
        {
          type: 'Cotton',
          material: 'Zephyr Cotton',
          quantity: 5,
          condition: 'Used',
          listed_at: '2023-10-01T00:00:00Z',
          trader: 'Trader B',
        },
        {
          type: 'Cotton',
          material: 'Soft Cotton',
          quantity: 10,
          condition: 'New',
          listed_at: '2023-10-01T00:00:00Z',
          trader: 'Trader A',
        },
      ],
    });

    render(<ViewMatched />);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Soft Cotton');
    expect(rows[2]).toHaveTextContent('Zephyr Cotton');
  });

  test('calls fetchMaterials when selectedCloth changes', async () => {
    useMatchModule.useMatch.mockReturnValue({
      ...mockUseMatch,
      selectedCloth: 'Cotton',
    });

    navigationModule.fetchMaterials.mockResolvedValueOnce([]);

    render(<ViewMatched />);

    await waitFor(() => {
      expect(navigationModule.fetchMaterials).toHaveBeenCalledWith(
        'Cotton',
        mockUseMatch.setMaterials,
        mockUseMatch.setLoading,
        mockUseMatch.setError
      );
    });
  });
});
