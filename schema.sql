-- =============================================================================
-- RVP Library — Database Schema
-- =============================================================================

-- ── Master / Reference Tables ─────────────────────────────────────────────────

CREATE TABLE roles (
  role_id   SERIAL PRIMARY KEY,
  role_name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE status (
  status_id   SERIAL PRIMARY KEY,
  sequence_no INT,
  status_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE category (
  category_id   SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE types (
  type_id    SERIAL PRIMARY KEY,
  type_name  VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE config (
  config_id    SERIAL PRIMARY KEY,
  config_name  VARCHAR(100) NOT NULL,
  group_choice VARCHAR(100) NOT NULL,  -- 'audience' | 'api_type'
  create_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  tag_id     SERIAL PRIMARY KEY,
  tag_name   VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE department (
  department_id   SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Core Tables ───────────────────────────────────────────────────────────────

CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  role_id         INT REFERENCES roles(role_id) ON DELETE SET NULL,
  employee_id     VARCHAR(10)  UNIQUE,
  user_firstname  VARCHAR(255) NOT NULL,
  user_lastname   VARCHAR(255) NOT NULL,
  user_department VARCHAR(100),
  position        VARCHAR(100),
  user_pic        TEXT,
  email           VARCHAR(255) UNIQUE,
  slack           VARCHAR(100),
  phone           VARCHAR(20),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted      BOOLEAN DEFAULT FALSE
);

CREATE TABLE outsource (
  user_out_id SERIAL PRIMARY KEY,
  role_id     INT REFERENCES roles(role_id) ON DELETE SET NULL,
  first_name  VARCHAR(255) NOT NULL,
  last_name   VARCHAR(255) NOT NULL,
  company     VARCHAR(255),
  email       VARCHAR(255),
  phone       VARCHAR(20),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  project_id     SERIAL PRIMARY KEY,
  status_id      INT REFERENCES status(status_id)     ON DELETE SET NULL,
  type_id        INT REFERENCES types(type_id)        ON DELETE SET NULL,
  category_id    INT REFERENCES category(category_id) ON DELETE SET NULL,
  config_id      INT REFERENCES config(config_id)     ON DELETE SET NULL,  -- audience
  project_name   VARCHAR(255) NOT NULL,
  short_name     VARCHAR(50),
  project_pic    TEXT,
  description    TEXT,
  vendor         VARCHAR(255),
  dns            TEXT,
  link_name      TEXT,
  link_path      TEXT,
  frontend       TEXT,
  backend        TEXT,
  database       TEXT,
  devops         TEXT,
  infrastructure TEXT,
  integrations   TEXT,
  environments   TEXT,                                                      -- JSON: ["Production","Staging"]
  start_project  VARCHAR(50),
  end_project    VARCHAR(50),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted     BOOLEAN DEFAULT FALSE
);

-- ── Junction / Sub Tables ─────────────────────────────────────────────────────

CREATE TABLE team_members (
  team_id         SERIAL PRIMARY KEY,
  project_id      INT REFERENCES projects(project_id)  ON DELETE CASCADE,
  user_id         INT REFERENCES users(user_id)         ON DELETE SET NULL,
  user_out_id     INT REFERENCES outsource(user_out_id) ON DELETE SET NULL,
  role_name       VARCHAR(20) NOT NULL,   -- PM / SA / UXUI / DEV / USER
  user_group_name VARCHAR(100),           -- ใช้เฉพาะ USER role เช่น 'ฝ่าย HR'
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_functions (
  func_id    SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  func_text  VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  doc_id         VARCHAR(50) PRIMARY KEY,
  project_id     INT REFERENCES projects(project_id) ON DELETE CASCADE,
  name           VARCHAR(255) NOT NULL,
  url            TEXT,
  type           VARCHAR(20),   -- miro / excel / pdf / word
  version        INT DEFAULT 1,
  history        TEXT,          -- JSON array of version history
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by     VARCHAR(255),
  last_edited_at TIMESTAMP,
  last_edited_by VARCHAR(255)
);

CREATE TABLE api_connections (
  api_id      VARCHAR(50) PRIMARY KEY,
  project_id  INT REFERENCES projects(project_id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  type        VARCHAR(20),    -- Internal / External
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Activity / Work Tables ────────────────────────────────────────────────────

CREATE TABLE cr (
  cr_id      SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(user_id)       ON DELETE SET NULL,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  cr_no      VARCHAR(100) NOT NULL,
  cr_detail  TEXT,
  create_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  close_at   TIMESTAMP DEFAULT NULL
);

CREATE TABLE task (
  task_id          SERIAL PRIMARY KEY,
  project_id       INT REFERENCES projects(project_id) ON DELETE CASCADE,
  user_id          INT REFERENCES users(user_id)       ON DELETE SET NULL,
  cr_id            INT REFERENCES cr(cr_id)            ON DELETE SET NULL,
  role_id          INT REFERENCES roles(role_id)       ON DELETE SET NULL,
  type             VARCHAR(20),    -- deploy / feature / bug / review / refactor / doc / meeting / incident
  task_name        VARCHAR(255) NOT NULL,
  task_version     VARCHAR(50),
  task_description TEXT,
  date             VARCHAR(50),
  time             VARCHAR(10),
  env              VARCHAR(50),    -- Production / Staging / UAT
  ref              VARCHAR(100),   -- PR #245 / JIRA-123 / BUG-105
  create_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE request (
  req_id     SERIAL PRIMARY KEY,
  user_id    INT REFERENCES users(user_id)       ON DELETE SET NULL,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  req_no     VARCHAR(100) NOT NULL,
  req_detail TEXT,
  create_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  close_at   TIMESTAMP DEFAULT NULL
);

CREATE TABLE audit_log (
  log_id     VARCHAR(50) PRIMARY KEY,
  project_id INT REFERENCES projects(project_id) ON DELETE SET NULL,
  action     VARCHAR(20) NOT NULL,   -- add / edit / delete
  target     VARCHAR(100),
  user_name  VARCHAR(255),
  details    TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Seed Data (Master / Reference)
-- =============================================================================

INSERT INTO roles (role_id, role_name) VALUES
  (1, 'PM'), (2, 'SA'), (3, 'UXUI'), (4, 'DEV'), (5, 'USER');

INSERT INTO status (status_id, sequence_no, status_name) VALUES
  (1, 1, 'analysis'),
  (2, 2, 'develop'),
  (3, 3, 'maintenance'),
  (4, 4, 'golive');

INSERT INTO category (category_id, category_name) VALUES
  (1, 'Web App'),
  (2, 'Mobile App'),
  (3, 'Desktop App'),
  (4, 'API Service'),
  (5, 'Microservice'),
  (6, 'Hybrid');

INSERT INTO types (type_id, type_name) VALUES
  (1, 'พัฒนาเอง'),
  (2, 'จ้างพัฒนา');

INSERT INTO config (config_id, config_name, group_choice) VALUES
  (1, 'พนักงาน',         'audience'),
  (2, 'ตัวแทน',           'audience'),
  (3, 'บริษัทประกันภัย', 'audience'),
  (4, 'สถานพยาบาล',     'audience'),
  (5, 'ประชาชนทั่วไป',   'audience'),
  (6, 'Internal',          'api_type'),
  (7, 'External',          'api_type');

-- Reset sequences after manual inserts
SELECT setval(pg_get_serial_sequence('roles',    'role_id'),    MAX(role_id))    FROM roles;
SELECT setval(pg_get_serial_sequence('status',   'status_id'),  MAX(status_id))  FROM status;
SELECT setval(pg_get_serial_sequence('category', 'category_id'),MAX(category_id))FROM category;
SELECT setval(pg_get_serial_sequence('types',    'type_id'),    MAX(type_id))    FROM types;
SELECT setval(pg_get_serial_sequence('config',   'config_id'),  MAX(config_id))  FROM config;
