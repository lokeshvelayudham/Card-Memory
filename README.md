# Card Memory Game

Welcome to the Card Memory Game! 

This project is a fun and engaging card game built using React and Vite for the frontend, Node.js/Express for the backend, and MongoDB for data storage. This project is designed as a skill test where different developers can work on specific features based on their expertise.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Guide](#setup-guide)
- [Usage](#usage)
- [Task Breakdown](#task-breakdown)

## Project Description

The Card Memory Game is a classic memory matching game where players aim to match pairs of cards. The game tests memory and concentration. It’s designed for all ages and serves as a skill test for different development roles. The game will also have various levels, with harder levels incorporating cryptocurrency functionality.

## Features

- Engaging and user-friendly interface
- Real-time data handling with a Node.js backend
- Responsive design optimized for various devices
- Simple setup and easy-to-understand codebase
- Multi-role collaboration for the skill test

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Web3**: MetaMask integration for crypto payments (on hard level)
- **Smart Contract**: Simple contract for game logic

## Setup Guide

Follow the steps below to set up the project on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/testadminia/Card-Memory.git
   ```

2. Navigate into the project directory:
    ```bash
    cd Card-Memory
    ```

3. Set up the backend:
    ```bash
    cd ./backend
    npm install
    npm run dev
    ```

4. Open a new terminal console for the frontend:
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

## Usage

Once both the backend and frontend servers are running, navigate to http://localhost:5173 in your web browser to start playing the Card Memory Game!




## Task Breakdown

### Project Manager/Tech Lead Tasks:
- Define the project scope, timelines, and key deliverables.
- Coordinate between different roles (developers, designers, artists).
- Ensure smooth workflow of the project.
- Conduct code reviews and ensure best practices are followed.

### Frontend Developer Tasks:
- Implement the **login/register page's style** with basic HTML elements.
- Design the UI/UX for the game’s main screen, including the **Play Button** and **Instructions Button**.
- Implement **modal dialogs** for level selection after the user logs in and clicks the Play button.
  
### Backend Developer Tasks:
- Implement an API to **save the game result** and **fetch the history of game results**.
- Implement the necessary routes and database logic for storing user game history.
  
### Full Stack Developer Tasks:
- Complete the tasks for **Backend Developers** (save game result and get history).
- Implement a **page to see the user's gameplay history** on the frontend.
- Integrate the backend API with the frontend to display game results.

### Web3 Developer Tasks:
- Implement **MetaMask wallet connect** functionality for the user to connect their crypto wallet before starting a game.
- Add **crypto payment logic** to be used only for **Hard** level games. This should be triggered only after the user selects the Hard level.
  
### Smart Contract Developer Tasks:
- Implement a **simple smart contract** that controls the gameplay logic.
- The smart contract should handle game logic, such as validating moves and managing game results.

### Software Engineer Tasks:
- Optimize the game’s performance to ensure smooth gameplay, including efficient state management.
- Implement automated tests for frontend and backend to maintain code reliability.

### Designer Tasks:
- Develop assets such as buttons, icons, and card designs.
- Ensure that the design is responsive and user-friendly across different devices.

### Artist Tasks:
- Design and create unique card illustrations for different levels.
- Develop background assets and animations to enhance the game experience.



## Game Introduction

The game initially shows paired cards, with their front faces visible. When the player clicks on a card, it rotates to show its face. The user should then click a second card to try and match it with the first one. If the second card doesn't match, it hides again. If they match, both cards remain shown.

### Game Flow:
1. **Login/Register Page**: No styled elements, just a basic structure.
2. **Main Screen**: After logging in, the user will see a **Play button** and **Instructions button**.
3. **Level Selection Modal**: After clicking Play, a modal will show up to allow the user to select a difficulty level (Easy, Medium, or Hard).
4. **Gameplay**: Based on the selected difficulty, the user plays the game.
   - **Hard level** requires the user to connect their MetaMask wallet and use cryptocurrency to pay for each round.

Good luck and happy coding!
