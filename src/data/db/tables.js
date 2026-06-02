// ─────────────────────────────────────────────────────────────────────────────
// DB seed tables — mirrors the PostgreSQL schema.
// Each constant = one DB table as a JS array of row objects.
// SeedData.jsx imports from here and derives UI-compatible shapes.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = Date.now();
const DAY = 86400000;

// ── roles ─────────────────────────────────────────────────────────────────────
const roles = [
  { role_id: 1, role_name: 'PM' },
  { role_id: 2, role_name: 'SA' },
  { role_id: 3, role_name: 'UXUI' },
  { role_id: 4, role_name: 'DEV' },
  { role_id: 5, role_name: 'USER' },
];

// ── status ────────────────────────────────────────────────────────────────────
const status = [
  { status_id: 1, sequence_no: 1, status_name: 'analysis' },
  { status_id: 2, sequence_no: 2, status_name: 'develop' },
  { status_id: 3, sequence_no: 3, status_name: 'maintenance' },
  { status_id: 4, sequence_no: 4, status_name: 'golive' },
];

// ── type ──────────────────────────────────────────────────────────────────────
const type = [
  { type_id: 1, type_name: 'พัฒนาเอง',  created_at: NOW },
  { type_id: 2, type_name: 'จ้างพัฒนา', created_at: NOW },
];

// ── category (architecture) ───────────────────────────────────────────────────
const category = [
  { category_id: 1, category_name: 'Web App',      created_at: NOW },
  { category_id: 2, category_name: 'Mobile App',   created_at: NOW },
  { category_id: 3, category_name: 'Desktop App',  created_at: NOW },
  { category_id: 4, category_name: 'API Service',  created_at: NOW },
  { category_id: 5, category_name: 'Microservice', created_at: NOW },
  { category_id: 6, category_name: 'Hybrid',       created_at: NOW },
];

// ── config (dynamic dropdowns — group_choice: 'audience' | 'api_type') ────────
const config = [
  { config_id: 1, config_name: 'พนักงาน',         group_choice: 'audience', create_at: NOW },
  { config_id: 2, config_name: 'ตัวแทน',           group_choice: 'audience', create_at: NOW },
  { config_id: 3, config_name: 'บริษัทประกันภัย', group_choice: 'audience', create_at: NOW },
  { config_id: 4, config_name: 'สถานพยาบาล',     group_choice: 'audience', create_at: NOW },
  { config_id: 5, config_name: 'ประชาชนทั่วไป',   group_choice: 'audience', create_at: NOW },
  { config_id: 6, config_name: 'Internal',          group_choice: 'api_type', create_at: NOW },
  { config_id: 7, config_name: 'External',          group_choice: 'api_type', create_at: NOW },
];

// ── users (internal employees) ────────────────────────────────────────────────
const users = [
  { user_id: 1,  employee_id: '0001', user_firstname: 'สมชาย',   user_lastname: 'วงศ์ใหญ่',  user_pic: '👨‍💻', user_department: 'Engineering', role_id: 4, position: 'Tech Lead',           email: 'somchai.w@rvp.co.th', slack: '@somchai', phone: '081-234-5678',  created_at: NOW, update_at: NOW },
  { user_id: 2,  employee_id: '0002', user_firstname: 'มานี',    user_lastname: 'ใจดี',       user_pic: '👩‍💼', user_department: 'Engineering', role_id: 2, position: 'System Analyst',     email: 'manee.j@rvp.co.th',  slack: '@manee',   phone: '082-345-6789',      created_at: NOW, update_at: NOW },
  {  user_id: 3,  employee_id: '0003', user_firstname: 'นภา',     user_lastname: 'สดใส',       user_pic: '👩‍🎨', user_department: 'Design',      role_id: 3, position: 'UX/UI Designer',     email: 'napa.s@rvp.co.th',   slack: '@napa',    phone: '083-456-7890',  created_at: NOW, update_at: NOW },
  {  user_id: 4,  employee_id: '0004', user_firstname: 'ปิติ',    user_lastname: 'สุขใส',      user_pic: '🧑‍💻', user_department: 'Engineering', role_id: 4, position: 'Backend Developer',  email: 'piti.s@rvp.co.th',   slack: '@piti',    phone: '084-567-8901',   created_at: NOW, update_at: NOW },
  {  user_id: 5,  employee_id: '0005', user_firstname: 'วีระ',    user_lastname: 'พัฒนา',      user_pic: '👨‍💻', user_department: 'Engineering', role_id: 4, position: 'Frontend Developer', email: 'veera.p@rvp.co.th',  slack: '@veera',   phone: '085-678-9012',   created_at: NOW, update_at: NOW },
  {  user_id: 6,  employee_id: '0006', user_firstname: 'อาทิตย์', user_lastname: 'แสงทอง',     user_pic: '👨‍💼', user_department: 'Management',  role_id: 1, position: 'Project Manager',    email: 'atit.s@rvp.co.th',   slack: '@atit',    phone: '086-789-0123',    created_at: NOW, update_at: NOW },
  {  user_id: 7,  employee_id: '0007', user_firstname: 'จันทร์',  user_lastname: 'ฉัตรชัย',    user_pic: '👨‍💻', user_department: 'Engineering', role_id: 4, position: 'Senior Frontend',    email: 'jan.c@rvp.co.th',    slack: '@jan',     phone: '081-111-1111',   created_at: NOW, update_at: NOW },
  {  user_id: 8,  employee_id: '0008', user_firstname: 'ภัทร',    user_lastname: 'พิมพ์ดี',    user_pic: '🧔',  user_department: 'Engineering', role_id: 4, position: 'Senior Backend',     email: 'pat.p@rvp.co.th',    slack: '@pat',     phone: '081-222-2222',      created_at: NOW, update_at: NOW },
  {  user_id: 9,  employee_id: '0009', user_firstname: 'มาลี',    user_lastname: 'อ่อนหวาน',   user_pic: '👩',  user_department: 'QA',          role_id: 4, position: 'QA Engineer',        email: 'malee.o@rvp.co.th',  slack: '@malee',   phone: '081-333-3333',   created_at: NOW, update_at: NOW },
  { user_id: 10, employee_id: '0010', user_firstname: 'กานต์',   user_lastname: 'ทองดี',      user_pic: '🧑',  user_department: 'QA',          role_id: 4, position: 'QA Lead',            email: 'karn.t@rvp.co.th',   slack: '@karn',    phone: '081-444-4444',     created_at: NOW, update_at: NOW },
  { user_id: 11, employee_id: '0011', user_firstname: 'ฟ้า',     user_lastname: 'เพชรพราว',   user_pic: '👩‍🎨', user_department: 'Design',      role_id: 3, position: 'Product Designer',   email: 'fah.p@rvp.co.th',    slack: '@fah',     phone: '081-555-5555',       created_at: NOW, update_at: NOW },
  { user_id: 12, employee_id: '0012', user_firstname: 'ดาว',     user_lastname: 'ดวงเดือน',   user_pic: '👩‍🎨', user_department: 'Design',      role_id: 3, position: 'Visual Designer',    email: 'dao.d@rvp.co.th',    slack: '@dao',     phone: '081-666-6666',   created_at: NOW, update_at: NOW },
  { user_id: 13, employee_id: '0013', user_firstname: 'รัก',     user_lastname: 'ครองธรรม',   user_pic: '🧑‍💻', user_department: 'Engineering', role_id: 4, position: 'DevOps Engineer',    email: 'rak.k@rvp.co.th',    slack: '@rak',     phone: '081-777-7777',   created_at: NOW, update_at: NOW },
  { user_id: 14, employee_id: '0014', user_firstname: 'วรรณ',    user_lastname: 'จิตอาสา',    user_pic: '👨‍💻', user_department: 'Data',        role_id: 4, position: 'Data Engineer',      email: 'wan.j@rvp.co.th',    slack: '@wan',     phone: '081-888-8888',      created_at: NOW, update_at: NOW },
  { user_id: 15, employee_id: '0015', user_firstname: 'บุญ',     user_lastname: 'มีสุข',      user_pic: '👩',  user_department: 'Data',        role_id: 4, position: 'Data Analyst',       email: 'boon.m@rvp.co.th',   slack: '@boon',    phone: '081-999-9999',  created_at: NOW, update_at: NOW },
  { user_id: 16, employee_id: '0016', user_firstname: 'เอ',      user_lastname: 'บุญทอง',     user_pic: '🧑‍💻', user_department: 'Engineering', role_id: 4, position: 'Mobile Developer',   email: 'a.b@rvp.co.th',      slack: '@aboon',   phone: '082-100-1001',  created_at: NOW, update_at: NOW },
  { user_id: 17, employee_id: '0017', user_firstname: 'บี',      user_lastname: 'รวีกานต์',   user_pic: '🧔',  user_department: 'Engineering', role_id: 4, position: 'Mobile Developer',   email: 'b.r@rvp.co.th',      slack: '@bravi',   phone: '082-200-2002',    created_at: NOW, update_at: NOW },
  { user_id: 18, employee_id: '0018', user_firstname: 'ซี',      user_lastname: 'สถิตธรรม',   user_pic: '🧑',  user_department: 'Security',    role_id: 4, position: 'Security Engineer',  email: 'c.s@rvp.co.th',      slack: '@csec',    phone: '082-300-3003',       created_at: NOW, update_at: NOW },
  { user_id: 19, employee_id: '0019', user_firstname: 'ดี',      user_lastname: 'ดิเรกพล',    user_pic: '👨‍💼', user_department: 'IT',          role_id: 5, position: 'IT Support',         email: 'd.d@rvp.co.th',      slack: '@ddire',   phone: '082-400-4004',    created_at: NOW, update_at: NOW },
  { user_id: 20, employee_id: '0020', user_firstname: 'อี',      user_lastname: 'เอื้ออาทร',  user_pic: '👩‍💼', user_department: 'HR',          role_id: 5, position: 'HR Manager',         email: 'e.e@rvp.co.th',      slack: '@ehr',     phone: '082-500-5005',      created_at: NOW, update_at: NOW },
  { user_id: 21, employee_id: '0021', user_firstname: 'เอฟ',     user_lastname: 'ฟ้าใส',      user_pic: '👩',  user_department: 'HR',          role_id: 5, position: 'HR Specialist',      email: 'f.f@rvp.co.th',      slack: '@fhr',     phone: '082-600-6006',   created_at: NOW, update_at: NOW },
  { user_id: 22, employee_id: '0022', user_firstname: 'จี',      user_lastname: 'จิระวัฒน์',  user_pic: '🧑',  user_department: 'Business',    role_id: 2, position: 'Business Analyst',   email: 'g.j@rvp.co.th',      slack: '@gba',     phone: '082-700-7007',   created_at: NOW, update_at: NOW },
  { user_id: 23, employee_id: '0023', user_firstname: 'เฮช',     user_lastname: 'ทิพย์ทอง',   user_pic: '👨‍💼', user_department: 'Operations',  role_id: 5, position: 'Operations Manager', email: 'h.t@rvp.co.th',      slack: '@hops',    phone: '082-800-8008',     created_at: NOW, update_at: NOW },
  { user_id: 24, employee_id: '0024', user_firstname: 'ไอ',      user_lastname: 'อิ่มเอม',    user_pic: '👩',  user_department: 'Customer',    role_id: 5, position: 'Customer Success',   email: 'i.i@rvp.co.th',      slack: '@ics',     phone: '082-900-9009',   created_at: NOW, update_at: NOW },
];

// ── user_out (outsource / external contractors) ───────────────────────────────
// คนภายนอกที่ไม่มี account ในระบบ — สร้างชื่อเองได้
const user_out = [
  { user_out_id: 1,  role_id: 4, first_name: 'ก.',    last_name: 'ขยัน',   company: 'บริษัท Outsource A', created_at: NOW, update_at: NOW },
  { user_out_id: 2,  role_id: 4, first_name: 'ข.',    last_name: 'แข็งขัน', company: 'บริษัท Outsource A', created_at: NOW, update_at: NOW },
  { user_out_id: 3,  role_id: 4, first_name: 'ค.',    last_name: 'เก่ง',   company: 'บริษัท Outsource A', created_at: NOW, update_at: NOW },
  { user_out_id: 4,  role_id: 4, first_name: 'ง.',    last_name: 'งาม',    company: 'บริษัท Outsource A', created_at: NOW, update_at: NOW },
  { user_out_id: 5,  role_id: 4, first_name: 'จ.',    last_name: 'เจริญ',  company: 'บริษัท Outsource B', created_at: NOW, update_at: NOW },
  { user_out_id: 6,  role_id: 4, first_name: 'ฉ.',    last_name: 'ฉลาด',  company: 'บริษัท Outsource B', created_at: NOW, update_at: NOW },
  { user_out_id: 7,  role_id: 4, first_name: 'ช.',    last_name: 'ช่าง',   company: 'บริษัท Outsource B', created_at: NOW, update_at: NOW },
  { user_out_id: 8,  role_id: 4, first_name: 'ซ.',    last_name: 'ซื่อ',   company: 'บริษัท Outsource B', created_at: NOW, update_at: NOW },
  { user_out_id: 9,  role_id: 4, first_name: 'ฌ.',    last_name: 'เฌอ',    company: 'บริษัท Outsource C', created_at: NOW, update_at: NOW },
  { user_out_id: 10, role_id: 4, first_name: 'ญ.',    last_name: 'ญาดา',   company: 'บริษัท Outsource C', created_at: NOW, update_at: NOW },
  { user_out_id: 11, role_id: 4, first_name: 'ฎ.',    last_name: 'ฎีกา',   company: 'บริษัท Outsource C', created_at: NOW, update_at: NOW },
];

// ── projects ──────────────────────────────────────────────────────────────────
const projects = [
  {
    project_id: 1, project_name: 'User Management System', short_name: 'UMS', project_pic: '💼',
    description: 'ระบบจัดการพนักงานภายในองค์กร RVP',
    frontend:       JSON.stringify(['React', 'Redux', 'HTML5', 'CSS3']),
    backend:        JSON.stringify(['Node.js', '.NET', 'Express']),
    database:       JSON.stringify(['PostgreSQL', 'MySQL', 'Redis']),
    devops:         JSON.stringify(['Docker', 'Jenkins']),
    infrastructure: JSON.stringify(['AWS', 'Kubernetes']),
    integrations:   JSON.stringify(['LDAP', 'SMTP']),
    dns: 'ums.rvp.co.th', status_id: 3, type_id: 1, category_id: 1, config_id: 1,
    user_id: 6, vendor: null, link_name: null, link_path: null, is_deleted: false,
    start_project: null, end_project: null,
    created_at: NOW - 400 * DAY, update_at: NOW - 2 * DAY,
    environments: ['Production', 'Staging', 'UAT'],
  },
  {
    project_id: 2, project_name: 'e-Agent System', short_name: 'e-Agent', project_pic: '🚀',
    description: 'ระบบสำหรับตัวแทนประกัน ใช้ในการขายและจัดการกรมธรรม์',
    frontend:       JSON.stringify(['Angular', 'TypeScript']),
    backend:        JSON.stringify(['Node.js', 'Laravel']),
    database:       JSON.stringify(['MySQL', 'MongoDB']),
    devops:         JSON.stringify(['Docker']),
    infrastructure: JSON.stringify(['AWS']),
    integrations:   JSON.stringify(['LINE Notify']),
    dns: 'agent.rvp.co.th', status_id: 4, type_id: 1, category_id: 1, config_id: 2,
    user_id: 6, vendor: null, link_name: null, link_path: null, is_deleted: false,
    start_project: null, end_project: null,
    created_at: NOW - 700 * DAY, update_at: NOW - 6 * DAY,
    environments: ['Production', 'Staging'],
  },
  {
    project_id: 3, project_name: 'ซื้อประกัน พ.ร.บ. รถจักรยานยนต์', short_name: 'พ.ร.บ.', project_pic: '🚗',
    description: 'ระบบซื้อประกัน พ.ร.บ. สำหรับรถจักรยานยนต์ออนไลน์',
    frontend:       JSON.stringify(['React', 'Next.js']),
    backend:        JSON.stringify(['.NET Core']),
    database:       JSON.stringify(['MS SQL Server']),
    devops:         JSON.stringify(['Docker']),
    infrastructure: JSON.stringify(['Azure']),
    integrations:   JSON.stringify(['Stripe']),
    dns: 'cmi.rvpd.co.th', status_id: 4, type_id: 2, category_id: 1, config_id: 5,
    user_id: 6, vendor: 'บริษัท ABC Software จำกัด', link_name: null, link_path: null, is_deleted: false,
    start_project: null, end_project: null,
    created_at: NOW - 500 * DAY, update_at: NOW - 14 * DAY,
    environments: ['Production'],
  },
  {
    project_id: 4, project_name: 'eClaim สำหรับบริษัทประกันภัย', short_name: 'eClaim', project_pic: '🛡️',
    description: 'ระบบเคลมออนไลน์สำหรับบริษัทประกันภัยพันธมิตร',
    frontend:       JSON.stringify(['Vue.js']),
    backend:        JSON.stringify(['Spring Boot']),
    database:       JSON.stringify(['Oracle']),
    devops:         JSON.stringify(['Docker']),
    infrastructure: JSON.stringify(['Private Cloud']),
    integrations:   JSON.stringify(['Insurance APIs']),
    dns: 'eclaim-ins.rvp.co.th', status_id: 2, type_id: 2, category_id: 1, config_id: 3,
    user_id: 6, vendor: 'บริษัท XYZ Insurtech', link_name: null, link_path: null, is_deleted: false,
    start_project: null, end_project: null,
    created_at: NOW - 200 * DAY, update_at: NOW - 30 * DAY,
    environments: ['Production', 'UAT'],
  },
  {
    project_id: 5, project_name: 'eClaim สำหรับสถานพยาบาล', short_name: 'eClaim', project_pic: '🏥',
    description: 'ระบบเคลมสำหรับโรงพยาบาล/คลินิก',
    frontend:       JSON.stringify(['React']),
    backend:        JSON.stringify(['Node.js']),
    database:       JSON.stringify(['PostgreSQL']),
    devops:         JSON.stringify(['Docker']),
    infrastructure: JSON.stringify(['AWS']),
    integrations:   JSON.stringify(['HIS API']),
    dns: 'eclaim-hosp.rvp.co.th', status_id: 1, type_id: 2, category_id: 4, config_id: 4,
    user_id: 6, vendor: 'บริษัท HealthTech Solutions', link_name: null, link_path: null, is_deleted: false,
    start_project: null, end_project: null,
    created_at: NOW - 90 * DAY, update_at: NOW - 60 * DAY,
    environments: ['Production'],
  },
];

// ── team_members (junction: project ↔ user + role) ────────────────────────────
// user_id     → อ้างอิง users (พนักงานภายในที่มี account)
// user_out_id → อ้างอิง user_out (outsource ไม่มี account)
// USER role   → ใช้ display_name เป็นชื่อกลุ่มผู้ใช้งาน (ไม่ใช่คนคนเดียว)
const team_members = [
  // Project 1 — UMS
  { team_id: 1,  project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่', role_name: 'PM',   user_id: 1,    user_out_id: null },
  { team_id: 2,  project_id: 1, user_display_name: 'คุณมานี ใจดี',        role_name: 'SA',   user_id: 2,    user_out_id: null },
  { team_id: 3,  project_id: 1, user_display_name: 'คุณนภา สดใส',         role_name: 'UXUI', user_id: 3,    user_out_id: null },
  { team_id: 4,  project_id: 1, user_display_name: 'คุณปิติ สุขใส',        role_name: 'DEV',  user_id: 4,    user_out_id: null },
  { team_id: 5,  project_id: 1, user_display_name: 'คุณวีระ พัฒนา',        role_name: 'DEV',  user_id: 5,    user_out_id: null },
  { team_id: 6,  project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่',  role_name: 'DEV',  user_id: 1,    user_out_id: null },
  { team_id: 7,  project_id: 1, user_display_name: 'นาย ก. ขยัน',          role_name: 'DEV',  user_id: null, user_out_id: 1  },
  { team_id: 8,  project_id: 1, user_display_name: 'นาย ข. แข็งขัน',       role_name: 'DEV',  user_id: null, user_out_id: 2  },
  { team_id: 9,  project_id: 1, user_display_name: 'นาย ค. เก่ง',          role_name: 'DEV',  user_id: null, user_out_id: 3  },
  { team_id: 10, project_id: 1, user_display_name: 'นาย ง. งาม',           role_name: 'DEV',  user_id: null, user_out_id: 4  },
  { team_id: 11, project_id: 1, user_display_name: 'นาย จ. เจริญ',         role_name: 'DEV',  user_id: null, user_out_id: 5  },
  { team_id: 12, project_id: 1, user_display_name: 'นาย ฉ. ฉลาด',         role_name: 'DEV',  user_id: null, user_out_id: 6  },
  { team_id: 13, project_id: 1, user_display_name: 'นาย ช. ช่าง',          role_name: 'DEV',  user_id: null, user_out_id: 7  },
  { team_id: 14, project_id: 1, user_display_name: 'นาย ซ. ซื่อ',          role_name: 'DEV',  user_id: null, user_out_id: 8  },
  { team_id: 15, project_id: 1, user_display_name: 'นาย ฌ. เฌอ',           role_name: 'DEV',  user_id: null, user_out_id: 9  },
  { team_id: 16, project_id: 1, user_display_name: 'นาย ญ. ญาดา',          role_name: 'DEV',  user_id: null, user_out_id: 10 },
  { team_id: 17, project_id: 1, user_display_name: 'นาย ฎ. ฎีกา',          role_name: 'DEV',  user_id: null, user_out_id: 11 },
  { team_id: 18, project_id: 1, user_display_name: 'ฝ่าย HR',               role_name: 'USER', user_id: null, user_out_id: null },
  { team_id: 19, project_id: 1, user_display_name: 'ฝ่าย IT',               role_name: 'USER', user_id: null, user_out_id: null },
  // Project 2 — e-Agent
  { team_id: 20, project_id: 2, user_display_name: 'คุณอาทิตย์ แสงทอง',   role_name: 'PM',   user_id: 6,    user_out_id: null },
  { team_id: 21, project_id: 2, user_display_name: 'คุณมานี ใจดี',          role_name: 'SA',   user_id: 2,    user_out_id: null },
  { team_id: 22, project_id: 2, user_display_name: 'คุณนภา สดใส',           role_name: 'UXUI', user_id: 3,    user_out_id: null },
  { team_id: 23, project_id: 2, user_display_name: 'คุณสมชาย วงศ์ใหญ่',   role_name: 'DEV',  user_id: 1,    user_out_id: null },
  { team_id: 24, project_id: 2, user_display_name: 'คุณปิติ สุขใส',          role_name: 'DEV',  user_id: 4,    user_out_id: null },
  { team_id: 25, project_id: 2, user_display_name: 'ฝ่ายตัวแทน',            role_name: 'USER', user_id: null, user_out_id: null },
  // Project 3 — พ.ร.บ.
  { team_id: 26, project_id: 3, user_display_name: 'คุณอาทิตย์ แสงทอง',   role_name: 'PM',   user_id: 6,    user_out_id: null },
  { team_id: 27, project_id: 3, user_display_name: 'คุณสมชาย วงศ์ใหญ่',   role_name: 'SA',   user_id: 1,    user_out_id: null },
  { team_id: 28, project_id: 3, user_display_name: 'ประชาชนทั่วไป',         role_name: 'USER', user_id: null, user_out_id: null },
  // Project 4 — eClaim insurance
  { team_id: 29, project_id: 4, user_display_name: 'คุณอาทิตย์ แสงทอง',   role_name: 'PM',   user_id: 6,    user_out_id: null },
  { team_id: 30, project_id: 4, user_display_name: 'คุณมานี ใจดี',          role_name: 'SA',   user_id: 2,    user_out_id: null },
  { team_id: 31, project_id: 4, user_display_name: 'บริษัทประกันภัย',       role_name: 'USER', user_id: null, user_out_id: null },
  // Project 5 — eClaim hospital
  { team_id: 32, project_id: 5, user_display_name: 'คุณอาทิตย์ แสงทอง',   role_name: 'PM',   user_id: 6,    user_out_id: null },
  { team_id: 33, project_id: 5, user_display_name: 'คุณมานี ใจดี',          role_name: 'SA',   user_id: 2,    user_out_id: null },
  { team_id: 34, project_id: 5, user_display_name: 'โรงพยาบาล',             role_name: 'USER', user_id: null, user_out_id: null },
];

// ── project_functions ─────────────────────────────────────────────────────────
const project_functions = [
  { func_id: 1,  project_id: 1, func_text: 'จัดการข้อมูลพนักงาน' },
  { func_id: 2,  project_id: 1, func_text: 'ระบบ Login + Permission' },
  { func_id: 3,  project_id: 1, func_text: 'ดูข้อมูลส่วนตัว/แก้ไข' },
  { func_id: 4,  project_id: 1, func_text: 'รายงานการใช้งาน' },
  { func_id: 5,  project_id: 2, func_text: 'ลงทะเบียนตัวแทน' },
  { func_id: 6,  project_id: 2, func_text: 'ออกกรมธรรม์ออนไลน์' },
  { func_id: 7,  project_id: 2, func_text: 'ดูประวัติการขาย' },
  { func_id: 8,  project_id: 3, func_text: 'ค้นหาข้อมูลรถ' },
  { func_id: 9,  project_id: 3, func_text: 'กรอกข้อมูลผู้เอาประกัน' },
  { func_id: 10, project_id: 3, func_text: 'ชำระเงินออนไลน์' },
  { func_id: 11, project_id: 4, func_text: 'ส่งข้อมูลเคลม' },
  { func_id: 12, project_id: 4, func_text: 'ตรวจสอบสถานะ' },
  { func_id: 13, project_id: 5, func_text: 'ลงทะเบียนผู้ป่วย' },
  { func_id: 14, project_id: 5, func_text: 'ส่งเคลมค่ารักษา' },
];

// ── documents ─────────────────────────────────────────────────────────────────
const documents = [
  { doc_id: 'd1', project_id: 1, name: 'Requirement Doc v3', url: '#', type: 'miro',  version: 3,
    created_at: NOW - 120 * DAY, created_by: 'somchai.w@rvp.co.th',
    last_edited_at: NOW - 5 * DAY, last_edited_by: 'manee.j@rvp.co.th',
    history: [
      { name: 'Requirement Doc v2', url: 'https://miro.com/app/board/req-v2', editedAt: NOW - 30 * DAY, editor: 'manee.j@rvp.co.th' },
      { name: 'Requirement Doc',    url: 'https://miro.com/app/board/req-v1', editedAt: NOW - 90 * DAY, editor: 'somchai.w@rvp.co.th' },
    ] },
  { doc_id: 'd2', project_id: 1, name: 'API Spec',             url: '#', type: 'excel', version: 1,
    created_at: NOW - 60 * DAY, created_by: 'piti.s@rvp.co.th',
    last_edited_at: NOW - 60 * DAY, last_edited_by: 'piti.s@rvp.co.th', history: [] },
  { doc_id: 'd3', project_id: 2, name: 'Business Requirement', url: '#', type: 'miro',  version: 1,
    created_at: NOW - 200 * DAY, created_by: 'atit.s@rvp.co.th',
    last_edited_at: NOW - 200 * DAY, last_edited_by: 'atit.s@rvp.co.th', history: [] },
  { doc_id: 'd4', project_id: 3, name: 'Vendor Contract',      url: '#', type: 'pdf',   version: 1,
    created_at: NOW - 300 * DAY, created_by: 'atit.s@rvp.co.th',
    last_edited_at: NOW - 300 * DAY, last_edited_by: 'atit.s@rvp.co.th', history: [] },
  { doc_id: 'd5', project_id: 4, name: 'TOR Document',         url: '#', type: 'pdf',   version: 1,
    created_at: NOW - 150 * DAY, created_by: 'atit.s@rvp.co.th',
    last_edited_at: NOW - 150 * DAY, last_edited_by: 'atit.s@rvp.co.th', history: [] },
  { doc_id: 'd6', project_id: 5, name: 'Contract',             url: '#', type: 'pdf',   version: 1,
    created_at: NOW - 80 * DAY, created_by: 'atit.s@rvp.co.th',
    last_edited_at: NOW - 80 * DAY, last_edited_by: 'atit.s@rvp.co.th', history: [] },
];

// ── api_connections ───────────────────────────────────────────────────────────
const api_connections = [
  { api_id: 'api1', project_id: 1, name: 'LDAP Authentication',    type: 'Internal', desc: 'เชื่อมต่อ Active Directory เพื่อ verify ชื่อผู้ใช้งานองค์กรตอน login' },
  { api_id: 'api2', project_id: 1, name: 'Email Service (SMTP)',   type: 'Internal', desc: 'ส่งอีเมลแจ้งเตือน + reset password ผ่าน SMTP relay ภายในองค์กร' },
  { api_id: 'api3', project_id: 2, name: 'Payment Gateway',        type: 'External', desc: 'รับชำระเงินผ่านบัตรเครดิต/QR PromptPay สำหรับการซื้อกรมธรรม์' },
  { api_id: 'api4', project_id: 2, name: 'SMS Service',            type: 'External', desc: 'ส่ง OTP ยืนยันตัวตน + แจ้งเตือนสถานะกรมธรรม์ผ่าน SMS' },
  { api_id: 'api5', project_id: 3, name: 'Stripe Payment',         type: 'External', desc: '' },
  { api_id: 'api6', project_id: 3, name: 'กรมการขนส่งฯ',          type: 'External', desc: '' },
  { api_id: 'api7', project_id: 4, name: 'Insurance Company API',  type: 'External', desc: '' },
  { api_id: 'api8', project_id: 5, name: 'HIS API',                type: 'External', desc: '' },
];

// ── tasks (activity log per person per project) ───────────────────────────────
const tasks = [
  { task_id: 1, project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่', type: 'deploy',   task_name: 'Deploy v2.3.1 ขึ้น Production',      task_description: 'Deploy version ใหม่ที่มี Performance improvement', date: '15 พ.ค. 2569', time: '14:30', task_version: 'v2.3.1', env: 'Production', ref: 'PR #245',      created_at: NOW - 13 * DAY },
  { task_id: 2, project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่', type: 'review',   task_name: 'Code Review PR #244',               task_description: 'Review PR ของคุณปิติ',                             date: '14 พ.ค. 2569', time: '10:15', task_version: '',       env: '',           ref: 'PR #244',      created_at: NOW - 14 * DAY },
  { task_id: 3, project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่', type: 'feature',  task_name: 'เพิ่มฟีเจอร์ Role-based Permission', task_description: 'พัฒนา feature การจัดการสิทธิ์',                  date: '10 พ.ค. 2569', time: '16:00', task_version: 'v2.3.0', env: '',           ref: 'JIRA UMS-156', created_at: NOW - 18 * DAY },
  { task_id: 4, project_id: 1, user_display_name: 'คุณสมชาย วงศ์ใหญ่', type: 'incident', task_name: 'แก้ปัญหา Login ช้า Production',      task_description: 'พบ database query slow',                          date: '5 พ.ค. 2569',  time: '22:30', task_version: '',       env: 'Production', ref: 'INC-2025-045', created_at: NOW - 23 * DAY },
  { task_id: 5, project_id: 1, user_display_name: 'คุณปิติ สุขใส',       type: 'feature',  task_name: 'พัฒนา API จัดการพนักงาน',           task_description: 'สร้าง REST API สำหรับ CRUD employees',             date: '12 พ.ค. 2569', time: '14:00', task_version: 'v2.3.0', env: '',           ref: 'PR #243',      created_at: NOW - 16 * DAY },
  { task_id: 6, project_id: 1, user_display_name: 'คุณปิติ สุขใส',       type: 'bug',      task_name: 'แก้ bug database connection',        task_description: 'แก้ปัญหา connection pool exhausted',              date: '8 พ.ค. 2569',  time: '20:15', task_version: '',       env: 'Production', ref: 'BUG-105',      created_at: NOW - 20 * DAY },
];

// ── audit_log ─────────────────────────────────────────────────────────────────
const audit_log = [
  { log_id: 'log_s1',  created_at: NOW - 30 * 1000,           action: 'edit',   target: 'Tech Stack', project_id: 1, user_name: 'Demo User', details: '' },
  { log_id: 'log_s2',  created_at: NOW - 8 * 60 * 1000,       action: 'add',    target: 'ฟังก์ชั่น',   project_id: 1, user_name: 'Demo User', details: 'รายงานการใช้งาน' },
  { log_id: 'log_s3',  created_at: NOW - 45 * 60 * 1000,      action: 'edit',   target: 'API',         project_id: 1, user_name: 'Demo User', details: 'LDAP Authentication' },
  { log_id: 'log_s4',  created_at: NOW - 3 * 60 * 60 * 1000,  action: 'add',    target: 'เอกสาร',      project_id: 1, user_name: 'Demo User', details: 'API Spec' },
  { log_id: 'log_s5',  created_at: NOW - 8 * 60 * 60 * 1000,  action: 'add',    target: 'ทีมงาน',      project_id: 1, user_name: 'Demo User', details: 'DEV: คุณวีระ พัฒนา' },
  { log_id: 'log_s6',  created_at: NOW - 22 * 60 * 60 * 1000, action: 'delete', target: 'API',         project_id: 1, user_name: 'Demo User', details: 'Legacy SOAP endpoint' },
  { log_id: 'log_s7',  created_at: NOW - 2 * DAY,             action: 'edit',   target: 'โปรเจ็ค',     project_id: 1, user_name: 'Demo User', details: 'User Management System' },
  { log_id: 'log_s8',  created_at: NOW - 4 * DAY,             action: 'add',    target: 'Activity',    project_id: 1, user_name: 'Demo User', details: 'Deploy v2.3.1 ขึ้น Production' },
  { log_id: 'log_s9',  created_at: NOW - 7 * DAY,             action: 'edit',   target: 'ฟังก์ชั่น',   project_id: 1, user_name: 'Demo User', details: 'ระบบ Login + Permission' },
  { log_id: 'log_s10', created_at: NOW - 14 * DAY,            action: 'add',    target: 'โปรเจ็ค',     project_id: 1, user_name: 'Demo User', details: 'User Management System' },
];

export {
  roles, status, type, category, config,
  users, user_out,
  projects, team_members, project_functions,
  documents, api_connections,
  tasks, audit_log,
};

// ── ตรวจสอบ integrity ────────────────────────────────────────────────────────
// team_members แต่ละ record ต้องมี user_id หรือ user_out_id อย่างใดอย่างหนึ่ง
// ยกเว้น USER role ที่เป็นชื่อกลุ่ม (ทั้งคู่ null ได้)

