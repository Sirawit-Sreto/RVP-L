-- ====================================================================
-- 1. กลุ่มตาราง Master / Config
-- ====================================================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL
);

CREATE TABLE status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL
);

CREATE TABLE config (
    config_id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    group_choice VARCHAR(100) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE position (
    position_id SERIAL PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- note config (drop down)
-- group_choice = tags, category, types, department, position
-- category = mobile app_master, .net app_master
-- types = INnHouse_master, OutSource_master
-- tags = Bug_master, Pending Review_master
-- position = PM_master,SA_master, UXUI_master, Dev_master
-- department = Information Technology_master, Software Development_master, DevOps & Infrastructure_master


-- ====================================================================
-- 2. กลุ่มตารางหลักของระบบ (Main Data)
-- ====================================================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(role_id) ON DELETE SET NULL,
    user_firstname VARCHAR(255) NOT NULL,
    user_lastname VARCHAR(255) NOT NULL,
    user_department VARCHAR(100),
    user_pic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    status_id INT REFERENCES status(status_id) ON DELETE SET NULL,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    config_id INT REFERENCES config(config_id) ON DELETE SET NULL,
    project_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
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

-- ทำการ ALTER TABLE พ่วงความสัมพันธ์จากโครงการกลับมาหัวหน้าทีมภายนอก (แก้ปัญหา Circular Dependency)
ALTER TABLE projects 
ADD COLUMN user_out_id INT REFERENCES outsource(user_out_id) ON DELETE SET NULL;


-- ====================================================================
-- 3. กลุ่มตารางกิจกรรม / งาน (Transactions)
-- ====================================================================

CREATE TABLE cr (
    cr_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
    cr_no VARCHAR(100) NOT NULL,
    cr_detail TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    close_at TIMESTAMP DEFAULT NULL
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
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    close_at TIMESTAMP DEFAULT NULL
);


-- ====================================================================
-- ⚡ 4. ระบบอัตโนมัติ (Trigger Function) รวมศูนย์ข้อมูลอัตโนมัติมาที่คลังกลาง config
-- ====================================================================

CREATE OR REPLACE FUNCTION sync_all_subtables_to_config()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'category' THEN
        INSERT INTO config (config_name, group_choice) VALUES (NEW.category_name, 'category');
    ELSIF TG_TABLE_NAME = 'types' THEN
        INSERT INTO config (config_name, group_choice) VALUES (NEW.type_name, 'types');
    ELSIF TG_TABLE_NAME = 'tags' THEN
        IF NEW.tag_name LIKE '%_master' THEN
            INSERT INTO config (config_name, group_choice) VALUES (NEW.tag_name, 'tags');
        ELSE
            INSERT INTO config (config_name, group_choice) VALUES (NEW.tag_name || '_master', 'tags');
        END IF;
    ELSIF TG_TABLE_NAME = 'position' THEN
        INSERT INTO config (config_name, group_choice) VALUES (NEW.position_name, 'position');
    ELSIF TG_TABLE_NAME = 'department' THEN
        INSERT INTO config (config_name, group_choice) VALUES (NEW.department_name, 'department');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สั่งเปิดกล้องดักจับผูกอุปกรณ์เข้ากับตารางย่อยทั้ง 5 ตัวสำหรับข้อมูลหน้าบ้านกรอกเพิ่มทีหลัง
CREATE TRIGGER trg_sync_category AFTER INSERT ON category FOR EACH ROW EXECUTE FUNCTION sync_all_subtables_to_config();
CREATE TRIGGER trg_sync_types AFTER INSERT ON types FOR EACH ROW EXECUTE FUNCTION sync_all_subtables_to_config();
CREATE TRIGGER trg_sync_tags AFTER INSERT ON tags FOR EACH ROW EXECUTE FUNCTION sync_all_subtables_to_config();
CREATE TRIGGER trg_sync_position AFTER INSERT ON position FOR EACH ROW EXECUTE FUNCTION sync_all_subtables_to_config();
CREATE TRIGGER trg_sync_department AFTER INSERT ON department FOR EACH ROW EXECUTE FUNCTION sync_all_subtables_to_config();


-- ====================================================================
-- 📥 5. ปิดโครงสร้าง Trigger ชั่วคราวเพื่อยัดยึดชุดข้อมูลตั้งต้น (ป้องกันไอดีชนวนลูป)
-- ====================================================================

ALTER TABLE category DISABLE TRIGGER trg_sync_category;
ALTER TABLE types DISABLE TRIGGER trg_sync_types;
ALTER TABLE tags DISABLE TRIGGER trg_sync_tags;
ALTER TABLE position DISABLE TRIGGER trg_sync_position;
ALTER TABLE department DISABLE TRIGGER trg_sync_department;

-- ยัดข้อมูลระบบควบคุม (สิทธิ์ / สถานะ)
INSERT INTO roles (role_id, role_name) VALUES (1, 'PM_master'), (2, 'SA_master'), (3, 'DEV_master');
INSERT INTO status (status_id, status_name) VALUES (1, 'Analysis'), (2, 'Develop'), (3, 'Go Live'), (4, 'Maintenance');

-- คลังกลางรวมศูนย์ Config (ID 1-13 ครบถ้วนตาม Note การใช้งาน)
INSERT INTO config (config_id, config_name, group_choice) VALUES 
(1, 'mobile app_master', 'category'),
(2, '.net app_master', 'category'),
(3, 'INnHouse_master', 'types'),
(4, 'OutSource_master', 'types'),
(5, 'Bug_master', 'tags'),
(6, 'Pending Review_master', 'tags'),
(7, 'PM_master', 'position'),
(8, 'SA_master', 'position'),
(9, 'UXUI_master', 'position'),
(10, 'Dev_master', 'position'),
(11, 'Information Technology_master', 'department'),
(12, 'Software Development_master', 'department'),
(13, 'DevOps & Infrastructure_master', 'department');

-- ข้อมูลลงคลังย่อย 5 ตารางขนานคู่กันแบบจองไอดีชุดแรก
INSERT INTO category (category_id, category_name) VALUES (1, 'mobile app_master'), (2, '.net app_master');
INSERT INTO types (type_id, type_name) VALUES (1, 'INnHouse_master'), (2, 'OutSource_master');
INSERT INTO tags (tag_id, tag_name) VALUES (1, 'Bug'), (2, 'Pending Review');
INSERT INTO position (position_id, position_name) VALUES (1, 'PM_master'), (2, 'SA_master'), (3, 'UXUI_master'), (4, 'Dev_master');
INSERT INTO department (department_id, department_name) VALUES (1, 'Information Technology_master'), (2, 'Software Development_master'), (3, 'DevOps & Infrastructure_master');

-- ====================================================================
-- 🔄 รีเซ็ตเข็มขัดตัววิ่งเลขอัตโนมัติ (Sequence) เพื่อให้คนที่กรอกเพิ่มทีหลังได้ต่อท้ายสวย ๆ
-- ====================================================================
SELECT setval(pg_get_serial_sequence('roles', 'role_id'), COALESCE(MAX(role_id), 1)) FROM roles;
SELECT setval(pg_get_serial_sequence('status', 'status_id'), COALESCE(MAX(status_id), 1)) FROM status;
SELECT setval(pg_get_serial_sequence('config', 'config_id'), COALESCE(MAX(config_id), 1)) FROM config;
SELECT setval(pg_get_serial_sequence('category', 'category_id'), COALESCE(MAX(category_id), 1)) FROM category;
SELECT setval(pg_get_serial_sequence('types', 'type_id'), COALESCE(MAX(type_id), 1)) FROM types;
SELECT setval(pg_get_serial_sequence('tags', 'tag_id'), COALESCE(MAX(tag_id), 1)) FROM tags;
SELECT setval(pg_get_serial_sequence('position', 'position_id'), COALESCE(MAX(position_id), 1)) FROM position;
SELECT setval(pg_get_serial_sequence('department', 'department_id'), COALESCE(MAX(department_id), 1)) FROM department;

-- ยัดข้อมูลธุรกรรมแวดล้อม (Users, Projects, Outsource, CR, Task, Request)
INSERT INTO users (user_id, role_id, user_firstname, user_lastname, user_department, user_pic) VALUES 
(1, 1, 'Sirawit', 'Sreto', 'Software Development_master', 'avatar_sirawit.png'),
(2, 1, 'Somchai', 'Jaidee', 'Information Technology_master', 'avatar_somchai.png'),
(3, 3, 'Anan', 'Dev', 'Software Development_master', 'avatar_anan.png'),
(4, 3, 'Somsri', 'QA', 'Information Technology_master', 'avatar_somsri.png');

INSERT INTO projects (project_id, status_id, user_id, config_id, project_name, company_name, start_project, end_project, project_pic, description, dns, frontend, backend, database, link_path, link_name) VALUES 
(1, 1, 2, 1, 'RVP SmartCare Portal', 'Road Accident Victims Protection Co., Ltd.', '2026-01-15', '2026-08-30', 'proj_smartcare.png', 'AI Claims Processing Engine with advanced automated detection parameters.', 'smartcare.rvp.co.th', 'React (Vite)', 'Node.js (Express)', 'PostgreSQL (Neon)', '/projects/rvp', 'RVP Rep'),
(2, 1, 2, 2, 'E-Commerce ERP System', 'Soft Square Group', '2026-02-01', '2026-12-15', 'proj_erp.png', 'Comprehensive enterprise logistics planning core system.', 'erp.softsquare.io', 'Angular', '.NET Core API', 'SQL Server', '/projects/erp', 'ERP Src');

INSERT INTO outsource (user_out_id, user_id, role_id, project_id, first_name, last_name) VALUES 
(1, 2, 3, 1, 'John', 'Doe'),
(2, 2, 3, 2, 'Jane', 'Smith');

UPDATE projects SET user_out_id = 1 WHERE project_id = 1;
UPDATE projects SET user_out_id = 2 WHERE project_id = 2;

INSERT INTO cr (cr_id, user_id, project_id, cr_no, cr_detail) VALUES 
(1, 2, 1, 'CR-RVP-001', 'Add PromptPay QR Code payment processing for online insurance setups.'),
(2, 2, 2, 'CR-ERP-001', 'Modify layout data structures to support customizable report modules.');

INSERT INTO task (task_id, project_id, user_id, config_id, cr_id, role_id, task_name, task_version, task_description) VALUES 
(1, 1, 3, 3, 1, 3, 'Implement PromptPay QR Webhook', 'v1.1.0', 'Develop production banking webhook listeners for handling settlement callbacks.'),
(2, 1, 4, 5, NULL, 3, 'Fix Boundary Value Logic on Detection', 'v1.1.1', 'Debug numerical threshold boundary arrays triggering server side evaluation faults.'),
(3, 2, 1, 6, 2, 3, 'Refactor Dashboard Layout for Pending Review', 'v2.0.1', 'Sync styling layout metrics into frontend view controllers.');

INSERT INTO request (req_id, user_id, project_id, req_no, req_detail) VALUES 
(1, 3, 1, 'REQ-001', 'End-user submitted request to allow custom toggling of layout panels.'),
(2, 4, 2, 'REQ-002', 'Deploy server health alert updates into active staging slack channels.');

-- รีเซ็ตค่าตัววิ่งเลขของกลุ่มธุรกรรมตัวที่เหลือ
SELECT setval(pg_get_serial_sequence('users', 'user_id'), COALESCE(MAX(user_id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('projects', 'project_id'), COALESCE(MAX(project_id), 1)) FROM projects;
SELECT setval(pg_get_serial_sequence('outsource', 'user_out_id'), COALESCE(MAX(user_out_id), 1)) FROM outsource;
SELECT setval(pg_get_serial_sequence('cr', 'cr_id'), COALESCE(MAX(cr_id), 1)) FROM cr;
SELECT setval(pg_get_serial_sequence('task', 'task_id'), COALESCE(MAX(task_id), 1)) FROM task;
SELECT setval(pg_get_serial_sequence('request', 'req_id'), COALESCE(MAX(req_id), 1)) FROM request;


-- ====================================================================
-- ⚡ 6. เปิดทำงานกลไก Trigger ให้กลับมาพร้อมแสตนด์บาย Sync งานแบบ Real-time
-- ====================================================================
ALTER TABLE category ENABLE TRIGGER trg_sync_category;
ALTER TABLE types ENABLE TRIGGER trg_sync_types;
ALTER TABLE tags ENABLE TRIGGER trg_sync_tags;
ALTER TABLE position ENABLE TRIGGER trg_sync_position;
ALTER TABLE department ENABLE TRIGGER trg_sync_department;