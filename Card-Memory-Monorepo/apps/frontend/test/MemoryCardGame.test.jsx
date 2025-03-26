/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MemoryCardGame from '../src/MemoryCardGame/MemoryCardGame';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock the modules
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@react-spring/web', () => ({
  useSpring: () => ({ transform: 'rotateY(0deg)' }),
  animated: { div: ({ children }) => <div>{children}</div> }
}));

jest.mock('axios');

// Mock the audio elements
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = jest.fn();
  global.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    volume: 0.5,
  }));
});

describe('MemoryCardGame Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.clearAllMocks();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'bgVolume') return '50';
      if (key === 'sfxVolume') return '50';
      if (key === 'userID') return 'test-user';
      return null;
    });
  });

  it('renders without crashing', () => {
    render(<MemoryCardGame />);
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
    expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('starts a new game when New Game button is clicked', async () => {
    render(<MemoryCardGame />);
    
    const newGameButton = screen.getByText('New Game');
    fireEvent.click(newGameButton);
    
    await waitFor(() => {
      expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
      expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
    });
  });

  it('shows confirmation modal when Back button is clicked', () => {
    render(<MemoryCardGame />);
    
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    
    expect(screen.getByText('Are you sure you want to go back to the play page?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('navigates to play page when Yes is clicked in modal', async () => {
    render(<MemoryCardGame />);
    
    fireEvent.click(screen.getByText('Back'));
    fireEvent.click(screen.getByText('Yes'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/play');
    });
  });

  it('closes modal when No is clicked', async () => {
    render(<MemoryCardGame />);
    
    fireEvent.click(screen.getByText('Back'));
    fireEvent.click(screen.getByText('No'));
    
    await waitFor(() => {
      expect(screen.queryByText('Are you sure you want to go back to the play page?')).not.toBeInTheDocument();
    });
  });

  it('handles card clicks and matching', async () => {
    render(<MemoryCardGame />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
    });
    
    const cards = screen.getAllByAltText('Card back');
    expect(cards.length).toBe(12);
    
    // Click first two cards (should be a match)
    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    
    expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
  });

  it('handles failed attempts', async () => {
    render(<MemoryCardGame />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
    
    const cardBacks = screen.getAllByAltText('Card back');
    expect(cardBacks.length).toBe(12);

    // Find indices of different card types
    const earthIndices = [];
    const jupiterIndices = [];
    
    const cards = screen.getAllByAltText('Card front');
    cards.forEach((card, index) => {
      if (card.src.includes('earth')) {
        earthIndices.push(index);
      } else if (card.src.includes('jupiter')) {
        jupiterIndices.push(index);
      }
    });

    // Click one earth and one jupiter to force a failed attempt
    fireEvent.click(cardBacks[earthIndices[0]]);
    fireEvent.click(cardBacks[jupiterIndices[0]]);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
    
    const counterElement = await screen.findByText(/Learning Moments: [1-9]/);
    expect(counterElement).toBeInTheDocument();
  }, 10000);

  it('completes the game when all matches are found', async () => {
    axios.post.mockResolvedValue({ data: {} });
    localStorage.setItem('userID', 'test-user');
    
    const { rerender } = render(<MemoryCardGame />);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
    });
    
    const cardBacks = screen.getAllByAltText('Card back');
    expect(cardBacks.length).toBe(12);
    
    // Group cards by type
    const cardGroups = {};
    const cardFronts = screen.getAllByAltText('Card front');
    cardFronts.forEach((card, index) => {
      const type = card.src.split('/').pop().split('.')[0]; // earth, jupiter, etc.
      if (!cardGroups[type]) cardGroups[type] = [];
      cardGroups[type].push(index);
    });
    
    // Match all pairs
    for (const type in cardGroups) {
      const [first, second] = cardGroups[type];
      fireEvent.click(cardBacks[first]);
      fireEvent.click(cardBacks[second]);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
      });
    }
    
    rerender(<MemoryCardGame />);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
  }, 10000);

  it('handles audio initialization', async () => {
    render(<MemoryCardGame />);
    
    fireEvent.click(screen.getByText('Back'));
    
    await waitFor(() => {
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });
  });
});