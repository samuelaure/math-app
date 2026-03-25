# MathGarden

## Description
A Montessori-inspired, progressive web app (PWA) designed to teach children aged 3-9 basic arithmetic in a calm, low-stimulation digital environment. It dynamically scales difficulty offline and visualizes progress through a growing digital garden.

## Stack
- **Frontend Framework**: React 18, Vite
- **Styling**: Vanilla CSS, Framer Motion (for physics and animations)
- **Data Persistence**: LocalStorage (Offline-first approach)
- **Routing**: React Router DOM

## Quick Start
1. Clone the repository.
2. Ensure you have Node.js v20.0.0+ installed.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the local development server.

## Architecture
This project is an offline-first Single Page Application consisting of four primary modules:
- **MathEngine**: Pure functions handling logic and automatic difficulty progression.
- **SandboxUI**: The drag-and-drop, interactive front-end.
- **GardenView**: Gamification and visual rewards.
- **Dashboard**: Parent controls and analytics.
