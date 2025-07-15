# To-Do Application

## Setup

### Backend (Django)
1. Clone the repository: `git clone <repo-url>`
2. Navigate to `todo_api/`: `cd todo_api`
3. Create a virtual environment: `python -m venv venv`
4. Activate: `.\venv\Scripts\activate` (Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Run migrations: `python manage.py migrate`
7. Start server: `python manage.py runserver`

### Frontend (Vite + React)
1. Navigate to `todo-frontend/`: `cd todo-frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. For production build: `npm run build`

## Usage
- Access the app at `http://localhost:5173`
- Register, log in, and manage tasks.
- Features:
  - Create, view, edit, and delete tasks.
  - View task details.
  - Toggle task status.
  - Filter tasks by All, Completed, Incomplete, or Upcoming (due within 7 days).
  - Reorder tasks using drag-and-drop.
  - User authentication (register, login, logout).

## Deployment
- **Backend**: Deploy to Heroku or Render. Update `CORS_ALLOWED_ORIGINS` with the deployed frontend URL.
- **Frontend**: Deploy to Netlify or Vercel. Run `npm run build` to generate the `dist/` folder and deploy it. Update API base URL in frontend to point to the deployed backend.




# To-Do API Documentation

## Base URL
`http://localhost:8000/api/`

## Authentication
- **Register**: `POST /register/`
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "id": int, "username": "string" }`
- **Login**: `POST /login/`
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "access": "JWT token", "refresh": "JWT refresh token" }`
- **Refresh Token**: `POST /token/refresh/`
  - Body: `{ "refresh": "JWT refresh token" }`
  - Response: `{ "access": "new JWT token" }`

## Tasks
- **List/Create Tasks**: `GET/POST /tasks/`
  - Authorization: `Bearer <JWT token>`
  - Query Parameters:
    - `status=true`: Filter for completed tasks.
    - `status=false`: Filter for incomplete tasks.
    - `upcoming=true`: Filter for tasks due within the next 7 days.
  - POST Body: `{ "title": "string", "description": "string", "status": boolean, "due_date": "YYYY-MM-DD", "order": int }`
  - Response: List of tasks or created task
- **Retrieve/Update/Delete Task**: `GET/PUT/DELETE /tasks/<id>/`
  - Authorization: `Bearer <JWT token>`
  - PUT Body: `{ "title": "string", "description": "string", "status": boolean, "due_date": "YYYY-MM-DD", "order": int }`
  - Response: Task details or success/failure
- **Update Task Order**: `POST /tasks/order/`
  - Authorization: `Bearer <JWT token>`
  - Body: `[{ "id": int, "order": int }, ...]`
  - Response: `200 OK` or `400 Bad Request`
