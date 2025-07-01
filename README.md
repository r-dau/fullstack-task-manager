# Fullstack Task Manager

A fullstack task management application with user authentication and task CRUD functionality.

## Features

- User authentication (Register/Login with JWT)  
- Full CRUD functionality for tasks (Create, Read, Update, Delete)  
- Global state management using Context API (AuthContext & TaskContext)  
- Private routing to protect certain routes  
- Clean separation of frontend and backend  
- Local development database managed with Prisma  

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS  
- Backend: Node.js, Express, Prisma ORM  
- Database: SQLite (for development and testing)  
- Authentication: JSON Web Tokens (JWT)  
- Testing: Jest, Supertest  

## Getting Started

### Prerequisites

- Node.js (version >= 16)  
- npm or yarn  

### Installation

```bash
1. Clone the repository:
   git clone https://github.com/r-dau/fullstack-task-manager.git
   cd fullstack-task-manager

2. Install backend dependencies:
   cd server
   npm install

3. Install frontend dependencies:
   cd ../client
   npm install

4. Create a `.env` file inside the `server/` directory with the following content:
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret"

5. Run Prisma migrations to set up the development database:
   cd ../server
   npx prisma migrate dev

6. Start the backend server:
   npm run dev

7. In a new terminal, start the frontend development server:
   cd ../client
   npm run dev

8. Open your browser and visit:
   http://localhost:5173
```

### Running Tests

```bash
  cd server
  npm run dev
  open new tab in terminal and navigate to fullstack-task-manager/server/
  npm test
```



