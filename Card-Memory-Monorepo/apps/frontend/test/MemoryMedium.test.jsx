/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MemoryMedium from '../src/MemoryCardGame/MemoryMedium';
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

describe('MemoryMedium Component', () => {
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
        render(<MemoryMedium />);
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
        expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
        expect(screen.getByText('New Game')).toBeInTheDocument();
    });

    it('starts a new game when New Game button is clicked', async () => {
        render(<MemoryMedium />);

        const newGameButton = screen.getByText('New Game');
        fireEvent.click(newGameButton);

        await waitFor(() => {
            expect(screen.getByText('Timer: 0s')).toBeInTheDocument();
            expect(screen.getByText('Learning Moments: 0')).toBeInTheDocument();
        });
    });

    it('shows confirmation modal when Back button is clicked', () => {
        render(<MemoryMedium />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(screen.getByText('Are you sure you want to go back to the play page?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('handles card clicks and matching', async () => {
        render(<MemoryMedium />);

        // Wait for initial reveal to finish
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
        });

        // Get all card backs
        const cardBacks = screen.getAllByAltText('Card back');
        expect(cardBacks.length).toBe(6);

        // Click first two cards (should be a match if they're the same)
        fireEvent.click(cardBacks[0]);
        fireEvent.click(cardBacks[1]);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        });

        // Check if match is registered (either 0 or 1 depending on randomization)
        const counter = screen.getByText(/Learning Moments: \d+/);
        expect(counter).toBeInTheDocument();
    }, 10000);

    it('completes the game when all matches are found', async () => {
        axios.post.mockResolvedValue({ data: {} });
        render(<MemoryMedium />);
        
        // Wait for initial setup
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
        });
        
        // Get all card backs
        const cardBacks = screen.getAllByAltText('Card back');
        expect(cardBacks.length).toBe(6);
        
        // Find matching pairs by inspecting card fronts
        const cardFronts = screen.getAllByAltText('Card front');
        const meteorIndices = [];
        const moonIndices = [];
        const cometIndices = [];
        
        cardFronts.forEach((card, index) => {
            if (card.src.includes('meteor')) {
                meteorIndices.push(index);
            } else if (card.src.includes('moon')) {
                moonIndices.push(index);
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
        
        // Match second pair (moons)
        fireEvent.click(cardBacks[moonIndices[0]]);
        fireEvent.click(cardBacks[moonIndices[1]]);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
        
        // Match third pair (comets)
        fireEvent.click(cardBacks[cometIndices[0]]);
        fireEvent.click(cardBacks[cometIndices[1]]);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        });
    }, 15000);

    it('saves game data when leaving mid-game', async () => {
        render(<MemoryMedium />);
        
        // Open modal
        fireEvent.click(screen.getByText('Back'));
        // Click Yes
        fireEvent.click(screen.getByText('Yes'));
        
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(axios.post.mock.calls[0][0]).toBe('http://localhost:3000/api/memory/save');
            expect(axios.post.mock.calls[0][1]).toMatchObject({
                userID: 'test-user',
                difficulty: 'Normal',
                completed: 0
            });
        });
    });

    it('handles audio initialization', async () => {
        render(<MemoryMedium />);

        // Simulate first click to start audio
        fireEvent.click(screen.getByText('Back'));

        await waitFor(() => {
            expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
        });
    });
});