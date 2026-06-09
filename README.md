# PM & Outsource Backend

Express + PostgreSQL backend providing simple generic CRUD routes for frontend use.

**Requirements**
- Node.js (14+ recommended)
- PostgreSQL database

**Environment**
Create a `.env` file in the `backend/` folder with at least:

```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
PORT=5000
```

This project reads the database URL from `process.env.DATABASE_URL`.

**Install & Run**

```bash
cd backend
npm install
# Development (auto-restarts):
npm run dev
# Production:
npm start
```

**Database**
Load the schema into your Postgres database (replace with your connection string):

```bash
psql "$DATABASE_URL" -f schema.sql
```


**API Overview**
This backend exposes table-specific endpoints (implemented in `routes/genericRouter.js`). The router is mounted at the application root, so the available endpoints are at top-level paths such as `/users` and `/projects`.

Implemented endpoints (examples)
- `GET /users/list` — list up to 100 rows from `users`
- `GET /projects/list` — list up to 100 rows from `projects`
- `GET /config/list` — list up to 100 rows from `config`
- `GET /users/:id` — get user by id
- `GET /projects/:id` — get project by id
- `GET /config/:id` — get config by id
- `POST /config/update/:id` — update a config row (JSON body)

Health check endpoint:
- `GET /test-health/:table` — validates the requested table exists and the DB is reachable (returns status 200 when OK)

Notes on router mounting:
- The code also defines an `api` router under `/api` (see `routes/api.js`) but the table routes are available at root (`/users/...`, `/projects/...`, etc.) because `genericRouter` is mounted at `/` in `server.js`.

Examples (curl)

```bash
# List users:
curl http://localhost:5000/users/list

# Get user by id (replace 123):
curl http://localhost:5000/users/123

# Health check for table 'users':
curl http://localhost:5000/test-health/users

# เพิ่มแถวใหม่ ใช้กับ bash อย่าลืม cd backend ก่อนจะใช้ (example):
curl -X POST http://localhost:5000/users/update/7 \
  -H "Content-Type: application/json" \
  -d '{"role_id": 2, "user_firstname": "Sre", "user_lastname": "To", "user_pic": "PICPIC555", "is_deleted": false}'
```