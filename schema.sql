CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL
);

CREATE TABLE status (
  status_id SERIAL PRIMARY KEY,
  status_name VARCHAR(100) NOT NULL,
  sequence_no INT
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  role_id INT REFERENCES roles(role_id) ON DELETE SET NULL,
  user_firstname VARCHAR(255) NOT NULL,
  user_lastname VARCHAR(255) NOT NULL,
  user_department VARCHAR(100),
  user_pic TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  status_id INT REFERENCES status(status_id) ON DELETE SET NULL,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  user_out_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  task_id INT REFERENCES task(task_id) ON DELETE SET NULL,
  config_id INT REFERENCES config(config_id) ON DELETE SET NULL,
  project_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) ,
  start_project VARCHAR(255) NOT NULL,
  end_project VARCHAR(255),
  project_pic TEXT,
  description TEXT,
  dns TEXT,
  frontend TEXT,
  backend TEXT,
  database TEXT,
  link_path TEXT,
  link_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE cr (
  cr_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  cr_no VARCHAR(100) NOT NULL,
  cr_detail TEXT,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task (
  task_id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  config_id INT REFERENCES config(config_id) ON DELETE SET NULL,
  cr_id INT REFERENCES cr(cr_id) ON DELETE SET NULL,
  role_id INT REFERENCES roles(role_id) ON DELETE SET NULL,
  task_name VARCHAR(255) NOT NULL,
  task_version VARCHAR(255) NOT NULL,
  task_description VARCHAR(500),
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE request (
  req_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  req_no VARCHAR(100) NOT NULL,
  req_detail TEXT,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outsource (
  user_out_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
  role_id INT REFERENCES roles(role_id) ON DELETE SET NULL,
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE tags ( -- สถานะสิ่งที่แก้ไข 
  tag_id SERIAL PRIMARY KEY,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category ( -- mobile app, .net app
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE types ( -- IN/OUT source
  type_id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE department ( -- ฝ่ายที่เกี่ยวข้อง
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE position ( -- ตำแหน่งงานใน project
  position_id SERIAL PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE config (
  config_id SERIAL PRIMARY KEY,
  config_name VARCHAR(100) NOT NULL,
  group_choice VARCHAR(100) NOT NULL,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
