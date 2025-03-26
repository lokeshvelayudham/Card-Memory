/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MemoryEasy from '../src/MemoryCardGame/MemoryEasy';
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
window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();

beforeAll(() => {
    // Mock window.HTMLMediaElement
    window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = jest.fn();

    // Mock the audio files
    global.Audio = jest.fn().mockImplementation(() => ({
        play: jest.fn(),
        pause: jest.fn(),
        volume: 0.5,
    }));
});

describe('MemoryEasy Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        localStorage.clear();
        jest.clearAllMocks();

        // Mock localStorage
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'bgVolume') return '50';
            if (key === 'sfxVolume') return '50';
            return null;
        });
    });

    it('renders without crashing', () => {
        render(<MemoryEasy />);
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
        expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
        expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('starts a new game when New Game button is clicked', async () => {
        render(<MemoryEasy />);

        const newGameButton = screen.getByText('New Game');
        fireEvent.click(newGameButton);

        // Check if the timer is reset
        await waitFor(() => {
            expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
            expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
        });
    });

    it('shows confirmation modal when Back button is clicked', () => {
        render(<MemoryEasy />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(screen.getByText('Are you sure you want to go back to the play page?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('navigates to play page when Yes is clicked in modal', async () => {
        render(<MemoryEasy />);

        // Open modal
        fireEvent.click(screen.getByText('Back'));
        // Click Yes
        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/play');
        });
    });

    it('closes modal when No is clicked', async () => {
        render(<MemoryEasy />);

        // Open modal
        fireEvent.click(screen.getByText('Back'));
        // Click No
        fireEvent.click(screen.getByText('No'));

        await waitFor(() => {
            expect(screen.queryByText('Are you sure you want to go back to the play page?')).not.toBeInTheDocument();
        });
    });

    it('handles card clicks and matching', async () => {
        render(<MemoryEasy />);

        // Wait for initial reveal to finish
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
        });

        // Get all cards
        const cards = screen.getAllByAltText('Card back');
        expect(cards.length).toBe(4);

        // Click first two cards (should be a match)
        fireEvent.click(cards[0]);
        fireEvent.click(cards[1]);

        // Wait for match check
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        });

        // Check if match is registered
        expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
    });

    it('handles failed attempts', async () => {
        render(<MemoryEasy />);

        // Wait for initial reveal to finish
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
        });

        // Get all card backs
        const cardBacks = screen.getAllByAltText('Card back');

        // Verify we have exactly 4 cards (2 pairs)
        expect(cardBacks.length).toBe(4);

        // Find indices of meteor and comet cards
        const meteorIndices = [];
        const cometIndices = [];

        // We need to inspect the actual card images to find non-matching pairs
        const cards = screen.getAllByRole('img', { name: 'Card front' });
        cards.forEach((card, index) => {
            if (card.src.includes('meteor')) {
                meteorIndices.push(index);
            } else if (card.src.includes('comet')) {
                cometIndices.push(index);
            }
        });

        // Click one meteor and one comet to force a failed attempt
        fireEvent.click(cardBacks[meteorIndices[0]]);
        fireEvent.click(cardBacks[cometIndices[0]]);

        // Wait for animations and state updates
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
        });

        // Find the counter element more precisely
        const counterElement = await screen.findByText((content, element) => {
            // Only match the actual counter div, not any parent containers
            return element.classList.contains('css-fx2t7r') &&
                element.textContent.includes('Learning Moments');
        });

        // Verify the counter increased
        expect(counterElement.textContent).toMatch(/Learning Moments: [1-9]/);
    }, 10000); // Increased timeout

    it('completes the game when all matches are found', async () => {
        // Mock API and localStorage
        axios.post.mockResolvedValue({ data: {} });
        localStorage.setItem('userID', 'test-user');
        
        // Render component
        const { rerender } = render(<MemoryEasy />);
        
        // Wait for initial setup
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
        });
      
        // Get all card backs
        const cardBacks = screen.getAllByAltText('Card back');
        expect(cardBacks.length).toBe(4);
      
        // Find matching pairs by inspecting card fronts
        const cardFronts = screen.getAllByAltText('Card front');
        const meteorIndices = [];
        const cometIndices = [];
        
        cardFronts.forEach((card, index) => {
          if (card.src.includes('meteor')) {
            meteorIndices.push(index);
          } else if (card.src.includes('comet')) {
            cometIndices.push(index);
          }
        });
      
        // Match first pair (meteors)
        fireEvent.click(cardBacks[meteorIndices[0]]);
        fireEvent.click(cardBacks[meteorIndices[1]]);
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
        });
      
        // Match second pair (comets)
        fireEvent.click(cardBacks[cometIndices[0]]);
        fireEvent.click(cardBacks[cometIndices[1]]);
      
        // Force update and wait for effects
        rerender(<MemoryEasy />);
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
        });
      }, 10000);


    it('handles audio initialization', async () => {
        render(<MemoryEasy />);

        // Simulate first click to start audio
        fireEvent.click(screen.getByText('Back'));

        await waitFor(() => {
            expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
        });
    });
});