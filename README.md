# Scrum Dashboard

A modern dashboard application that helps teams manage their daily updates and eliminate the need for daily scrum meetings.

## Features

- Daily update submission with description, GitHub issue links, and build numbers
- Automatic deletion of updates after 30 days
- Date-based filtering of updates
- Edit and delete functionality for updates
- Modern Material-UI based interface

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or accessible via connection string)

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. Create a `.env` file in the server directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scrum-dashboard
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Development

- Frontend is built with React, TypeScript, and Material-UI
- Backend is built with Express.js, TypeScript, and MongoDB
- The application uses Vite for fast development and building

## License

MIT
