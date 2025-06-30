# Technical Debt Scanner

A web application that scans public GitHub repositories for technical debt. Enter a repository URL to receive a detailed breakdown of code smells and issues, categorized by programming language.

## How It Works

1.  **Submit URL:** The user enters a public GitHub repository URL on the main page.
2.  **Initiate Scan:** The frontend sends a request to a backend service (expected to be running on `http://localhost:8000/scan`).
3.  **Job Processing:** The backend starts an asynchronous scanning job and immediately returns a unique `job_id`.
4.  **Redirect & Poll:** The user is redirected to a results page (`/result/[job_id]`), which polls the backend's result endpoint (`/result/[job_id]`) every few seconds.
5.  **View Results:** Once the scan is complete, the results are displayed, showing a technical debt score broken down by language and a list of specific issues found.

## Features

-   Analyzes any public GitHub repository via its URL.
-   Asynchronous job processing for non-blocking analysis.
-   Real-time polling for scan results.
-   Displays an interactive results page with technical debt scores per language.
-   Provides an expandable breakdown of specific issues for each language.
-   Responsive interface built with Tailwind CSS and animated with Framer Motion.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Linting:** [ESLint](https://eslint.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20 or later)
-   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
-   A running instance of the corresponding backend service on `http://localhost:8000`. This frontend application is responsible for the user interface only.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jonas1q/tech-debt.git
    cd tech-debt
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode with Turbopack.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to find and fix problems in your code.
