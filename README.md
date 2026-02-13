# ADHD Assessment App

This is a React Native (Expo) mobile application for ADHD detection, designed to work with a FastAPI backend.

## Prerequisites
- Node.js
- Python (for the backend)
- Expo Go app on your mobile device OR Android Emulator / iOS Simulator

## Project Structure
- `src/api`: API client and service functions.
- `src/components`: Reusable UI components.
- `src/screens`: Application screens (Home, Questionnaire, Game, Result).
- `src/navigation`: Navigation configuration.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   - Open `src/api/client.ts`.
   - Update `BASE_URL` if you are running on a physical device.
     - Android Emulator: `http://10.0.2.2:8000` (Default)
     - iOS Simulator: `http://localhost:8000`
     - Physical Device: Use your computer's local IP (e.g., `http://192.168.1.5:8000`).

3. **Run the App**
   ```bash
   npx expo start
   ```
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Scan QR code with Expo Go for physical device.

## Backend Setup
Ensure your FastAPI backend is running:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Features
- **Questionnaire**: 18-item assessment for Parents and Teachers.
- **Reaction Game**: Measures reaction time, impulsivity, and focus consistency.
- **Diagnosis**: Displays the final result based on fused data from questionnaires and game performance.
