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
- Base route: `/api`
- Generic table router: `/api/:table` (supports CRUD and simple health check)

Allowed tables and their primary keys: tablePK

- `task` (task_id)
- `outsource` (user_out_id)
- `users` (user_id)
- `roles` (role_id)
- `cr` (cr_id)
- `request` (req_id)
- `projects` (project_id)
- `status` (status_id)
- `tags` (tag_id)
- `category` (category_id)
- `types` (type_id)
- `department` (department_id)
- `position` (position_id)
- `config` (config_id)

Additional endpoints:
- `GET /api/:table/health-check-status/:table` — checks DB connectivity for the table and returns `{ ready: true }` when healthy.

Shortcut routes:
- `GET /users` — convenience route that returns the same result as `GET /api/users` (implemented with route helpers).

Examples (curl)

```bash
# List up to 100 rows from `users`:
curl http://localhost:5000/users

# Get a single item by id:
curl http://localhost:5000/users/123

# Health check for `tablePK`:
curl 
curl 
```
