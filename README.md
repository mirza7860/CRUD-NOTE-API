# Note-Api (CRUD with Authentication)

Developed a complete end to end backend note api with crud operations . 

## Features

- User Authentication (Login, Logout, Register)
- Note Management (Create, Read, Update, Delete)

## Getting Started

### Technology Used

- Node.js
- npm
- Express.js
- MongoDB
- Mongoose
- Postman
  
### Installation

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `node index.js`.

## Usage

The project provides RESTful APIs for user authentication and note management.

### API Endpoints

- **User Authentication:**
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/register

- **Note Management:**
  - POST /api/notes (Create Note)
  - GET /api/notes (Get All Notes)
  - GET /api/notes/:userId (Get User Notes)
  - PATCH /api/notes/:noteId (Update Note)
  - DELETE /api/notes/:noteId (Delete Note)
  - POST /api/notes/:id/share (share note)
  - GET /api/search (   search for notes based on keywords for the authenticated user .  )
## Contributing

Feel free to contribute by submitting bug reports, feature requests, or pull requests.
