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
