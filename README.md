# Pot-o-Goals (POG)

**Pot-o-Goals** is a gamified goal-tracking and challenge application designed to help users achieve their targets through friendly competition. Users can join "pots" (challenges), track daily goals, earn tickets/coins, and compete on leaderboards.

## Features

-   **User Authentication**: Sign in and profile management via Firebase Auth.
-   **Challenge Groups ("Pots")**: Join shared challenges with custom rules.
-   **Goal Tracking**: Daily check-ins for personal goals within a challenge.
-   **Leaderboards**: Real-time ranking based on coins and tickets earned.
-   **Social Chat**: Built-in chat functionality for each challenge group.
-   **Schemes**: different scoring algorithms like "All or Nothing" (aon) or "Ticket per Goal" (tpg).

## Tech Stack (Archives)

This project was built during a learning phase (circa 2020) and utilizes an older stack:

-   **Frontend**: React 16.13 (Class Components)
-   **Languages**: JavaScript (ES6+), Sass (SCSS)
-   **Backend**: Firebase (Realtime Database, Authentication)
-   **Libraries**: 
    -   `re-base` (for binding Firebase State to React State)
    -   `react-scroll`
    -   `create-react-app` (Build tool)

## Setup & Run

> **Note**: Due to the age of the dependencies (React 16, older `react-scripts`), you may need an older version of Node.js (e.g., Node 12 or 14) to install dependencies without errors.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm start
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Modernization Roadmap

To bring this project up to modern standards (2025+), the following improvements are recommended:

### 1. Build Tool & Framework
-   **Migrate to Vite**: Replace `create-react-app` with Vite for significantly faster builds and dev server performance.
-   **Upgrade to React 18+**: Move to the latest React version to leverage concurrent features and automatic batching.

### 2. Architecture & Code Quality
-   **Functional Components & Hooks**: Refactor Class components (`Content.js`, etc.) to Functional components using Hooks (`useState`, `useEffect`).
-   **TypeScript**: Adopt TypeScript to add type safety, especially for the complex data structures in `challenges` and `user` objects.
-   **State Management**: Replace `re-base` with React Context, Redux Toolkit, or Zustand for more predictable state management without tight coupling to the DB library.

### 3. Backend (Firebase)
-   **Firebase Modal SDK**: partial imports (tree-shakable) from Firebase v9+. The current app uses the compat/v5 namespace style which imports the entire library.
-   **Firestore**: Consider moving from Realtime Database to Cloud Firestore for better querying capabilities and scalability.

### 4. Styling
-   **CSS Modules or Tailwind**: Move away from global Sass stylesheets to scoped CSS Modules or a utility-first framework like Tailwind CSS for better maintainability.

---
*Archived by [Antigravity](https://google.com) - 2026*
