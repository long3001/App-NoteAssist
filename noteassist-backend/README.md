# NoteAssist Backend

Backend service for the NoteAssist application, providing API endpoints for note-taking, speech-to-text, and user management.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Firebase (Authentication, Firestore, Storage)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   ```

4. Get Firebase credentials:
   - Go to Firebase Console
   - Create a new project or select existing one
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Copy the values to your .env file

## Development

Run the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## Building for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
└── app.ts          # Main application file
```

## API Documentation

API documentation will be added as endpoints are implemented.

## License

ISC 