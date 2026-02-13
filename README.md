# User Management Frontend

This is the frontend client for the User Management Video Platform, built with Next.js 13+.

## Tech Stack

-   **Framework**: Next.js 13 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Icons**: Lucide React
-   **State/Data**: React Hooks, Axios
-   **Forms**: React Hook Form, Zod

## Features

-   **Authentication**: Login, Register, Protected Routes.
-   **Dashboard**: Sidebar navigation, Video management table.
-   **Video Player**: Interactive player with visibility controls.
-   **Wallet**: UI for balance and withdrawal requests.
-   **Theme**: Dark/Light mode support.

## Getting Started

### Prerequisites

-   Node.js 18+
-   Backend service running on `http://localhost:3001`

### Installation

1.  Navigate to the directory:
    ```bash
    cd project
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment:
    ```bash
    cp .env.example .env
    ```
    Update `.env` with your API URL.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Running with Docker

You can run just the frontend container using the `docker-compose.yml` in this directory:

```bash
docker-compose up --build
```
