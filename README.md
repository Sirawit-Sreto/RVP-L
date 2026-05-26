# PM & Outsource Backend

Simple Express + PostgreSQL backend to serve as an API for the frontend.

Quick start

1. Create a `.env` file in `backend/` with your database connection, for example:

```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
PORT=5000
```

2. Install dependencies and start:

```bash
cd backend
npm install
npm run dev   # or npm start
```

3. Load schema into your Postgres database:

```bash
psql $DATABASE_URL -f schema.sql
```

API

- Generic CRUD endpoints are exposed under `/api/:table`.
- Allowed tables: `task`, `outsource`, `users`, `roles`, `cr`, `request`, `projects`, `status`, `tags`, `category`, `types`, `department`, `position`, `config`.

Examples

GET /api/users
POST /api/users { "user_firstname": "John", "user_lastname": "Doe" }

Postman

- Import the collection at [backend/postman_collection.json](backend/postman_collection.json) into Postman.
- Optionally import the environment at [backend/postman_environment.json](backend/postman_environment.json) and select it.
- Ensure your `baseUrl` (in environment) matches `http://localhost:5000` (or whatever `PORT` you set).
- Use the example requests to exercise the API (create -> list -> update -> delete).
