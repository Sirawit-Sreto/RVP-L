// seed-data.jsx — derives UI-compatible shapes from the DB seed tables.
// Source of truth lives in ./db/tables.js (mirrors PostgreSQL schema).
// When the real backend is ready, replace this file with API calls.

import {
  status, type, category, config,
  users, projects, team_members, project_functions,
  documents, api_connections, tasks, audit_log,
} from './db/tables'

// ── helpers ───────────────────────────────────────────────────────────────────
function tryParse(val, fallback = []) {
  try { return JSON.parse(val); } catch { return fallback; }
}

// ── lookup maps ───────────────────────────────────────────────────────────────
const _statusMap   = Object.fromEntries(status.map(s => [s.status_id, s.status_name]));
const _typeMap     = Object.fromEntries(type.map(t => [t.type_id, t.type_name]));
const _categoryMap = Object.fromEntries(category.map(c => [c.category_id, c.category_name]));
const _audienceMap = Object.fromEntries(
  config.filter(c => c.group_choice === 'audience').map(c => [c.config_id, c.config_name])
);
const _roleKeyMap  = { PM: 'pm', SA: 'sa', UXUI: 'uxui', DEV: 'dev', USER: 'user' };

// ── STATUS_OPTIONS ────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  analysis:    { tone: 'bg-amber-100 text-amber-700 border-amber-200',      dot: 'bg-amber-500' },
  develop:     { tone: 'bg-blue-100 text-blue-700 border-blue-200',          dot: 'bg-blue-500' },
  maintenance: { tone: 'bg-purple-100 text-purple-700 border-purple-200',    dot: 'bg-purple-500' },
  golive:      { tone: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
};
const STATUS_DISPLAY = { analysis: 'Analysis', develop: 'Develop', maintenance: 'Maintenance', golive: 'Go-Live' };

const STATUS_OPTIONS = status
  .sort((a, b) => a.sequence_no - b.sequence_no)
  .map(s => ({
    id:   s.status_name,
    th:   STATUS_DISPLAY[s.status_name] || s.status_name,
    dot:  STATUS_STYLE[s.status_name]?.dot  || 'bg-stone-400',
    tone: STATUS_STYLE[s.status_name]?.tone || 'bg-stone-100 text-stone-700 border-stone-200',
  }));

// ── DEFAULT lists ─────────────────────────────────────────────────────────────
const DEFAULT_ARCHITECTURES = category.map(c => c.category_name);
const DEFAULT_AUDIENCES     = config.filter(c => c.group_choice === 'audience').map(c => c.config_name);
const DEFAULT_API_TYPES     = config.filter(c => c.group_choice === 'api_type').map(c => c.config_name);
const DEFAULT_CATEGORIES    = ['RVP Library', ...DEFAULT_AUDIENCES];

// ── SEED_PEOPLE (keyed by display_name) ───────────────────────────────────────
const SEED_PEOPLE = Object.fromEntries(
  users.map(u => [`คุณ${u.user_firstname} ${u.user_lastname}`, {
    name:     `คุณ${u.user_firstname} ${u.user_lastname}`,
    position: u.position,
    dept:     u.user_department,
    avatar:   u.user_pic,
    email:    u.email,
    slack:    u.slack,
    phone:    u.phone,
  }])
);

// ── SEED_PROJECTS ─────────────────────────────────────────────────────────────
const SEED_PROJECTS = projects.map(p => {
  const techStack = {
    frontend:       tryParse(p.frontend),
    backend:        tryParse(p.backend),
    database:       tryParse(p.database),
    devops:         tryParse(p.devops),
    infrastructure: tryParse(p.infrastructure),
    integrations:   tryParse(p.integrations),
  };

  const members = team_members.filter(m => m.project_id === p.project_id);
  const team = { roles: [] };
  members.forEach(m => {
    const key = _roleKeyMap[m.role_name] || m.role_name.toLowerCase();
    if (!team[key]) team[key] = [];
    team[key].push(m.user_display_name);
  });

  const functions = project_functions
    .filter(f => f.project_id === p.project_id)
    .map(f => f.func_text);

  const docs = documents
    .filter(d => d.project_id === p.project_id)
    .map(d => ({
      id:           d.doc_id,
      name:         d.name,
      url:          d.url,
      type:         d.type,
      version:      d.version,
      createdAt:    d.created_at,
      createdBy:    d.created_by,
      lastEditedAt: d.last_edited_at,
      lastEditedBy: d.last_edited_by,
      history:      d.history || [],
    }));

  const apis = api_connections
    .filter(a => a.project_id === p.project_id)
    .map(a => ({ id: a.api_id, name: a.name, type: a.type, desc: a.desc }));

  const audienceName = _audienceMap[p.config_id] || '';

  return {
    id:           p.project_id,
    name:         p.short_name,
    subtitle:     audienceName,
    fullName:     p.project_name,
    icon:         p.project_pic,
    image:        '',
    category:     _categoryMap[p.category_id] || '',
    type:         _typeMap[p.type_id]     || 'พัฒนาเอง',
    audience:     audienceName,
    status:       _statusMap[p.status_id] || 'develop',
    dns:          p.dns    || '',
    vendor:       p.vendor || '',
    desc:         p.description || '',
    functions,
    team,
    docs,
    apis,
    techStack,
    environments: p.environments || [],
    lastEditAt:   p.update_at,
    createdAt:    p.created_at,
    is_deleted:   p.is_deleted,
  };
});

// ── SEED_ACTIVITIES ({ [project_id]: { [display_name]: [...] } }) ─────────────
const SEED_ACTIVITIES = {};
tasks.forEach(t => {
  if (!SEED_ACTIVITIES[t.project_id]) SEED_ACTIVITIES[t.project_id] = {};
  const bucket = SEED_ACTIVITIES[t.project_id];
  if (!bucket[t.user_display_name]) bucket[t.user_display_name] = [];
  bucket[t.user_display_name].push({
    id:      `a${t.task_id}`,
    type:    t.type,
    title:   t.task_name,
    desc:    t.task_description,
    date:    t.date,
    time:    t.time,
    version: t.task_version,
    env:     t.env,
    ref:     t.ref,
  });
});

// ── SEED_EDIT_HISTORY ─────────────────────────────────────────────────────────
const SEED_EDIT_HISTORY = audit_log.map(l => ({
  id:        l.log_id,
  timestamp: l.created_at,
  action:    l.action,
  target:    l.target,
  projectId: l.project_id,
  userName:  l.user_name,
  details:   l.details,
}));

// ── misc helpers used by components ──────────────────────────────────────────
const TECH_ICONS = {
  'React': '⚛️', 'Angular': '🅰️', 'Vue.js': '🟢', 'Next.js': '▲',
  'JavaScript': '🟨', 'TypeScript': '🔷', 'HTML5': '🟧', 'CSS3': '🟦',
  'Node.js': '🟢', '.NET': '🟣', '.NET Core': '🟣', 'Express': '⬛',
  'Laravel': '🔴', 'Spring Boot': '🌿',
  'PostgreSQL': '🐘', 'MySQL': '🐬', 'MongoDB': '🍃', 'Redis': '🔴',
  'MS SQL Server': '🟦', 'Oracle': '🔴',
  'Docker': '🐳', 'Kubernetes': '☸️', 'Jenkins': '🔨',
  'AWS': '☁️', 'Azure': '🔵', 'Private Cloud': '🔒', 'Redux': '🟪',
};

const USER_GROUP_EN = {
  'ฝ่าย HR': 'HR team', 'ฝ่าย IT': 'IT team',
  'ฝ่ายตัวแทน': 'Agent operations', 'ประชาชนทั่วไป': 'General public',
  'บริษัทประกันภัย': 'Insurance companies', 'โรงพยาบาล': 'Hospitals',
};

const EMOJI_OPTIONS = ['🟣', '⚙️', '🚀', '📊', '💼', '🏥', '🚗', '🛡️', '📱', '💻', '🔐', '📦'];
const ENVIRONMENT_OPTIONS = ['Production', 'Staging', 'UAT', 'Development'];

const PKG_DEP_MAP = {
  frontend:     ['react', 'vue', 'angular', 'next', 'nuxt', 'svelte', 'tailwind', 'sass', 'styled-components'],
  backend:      ['express', 'nestjs', 'fastify', 'koa', 'hapi'],
  database:     ['pg', 'mysql', 'mongodb', 'mongoose', 'redis', 'prisma', 'typeorm', 'postgres'],
  devops:       ['jest', 'eslint', 'prettier', 'webpack', 'vite', 'typescript', 'docker', 'kubernetes'],
  integrations: ['axios', 'graphql', 'stripe', 'jwt', 'passport', 'nodemailer', 'aws-sdk'],
};

const TECH_MAP_EXACT = {
  'react': 'frontend', 'vue': 'frontend', '@angular/core': 'frontend',
  'next': 'frontend', 'nuxt': 'frontend', 'svelte': 'frontend',
  'tailwindcss': 'frontend', 'sass': 'frontend', 'styled-components': 'frontend',
  'express': 'backend', '@nestjs/core': 'backend', 'fastify': 'backend',
  'koa': 'backend', 'hapi': 'backend',
  'pg': 'database', 'mysql2': 'database', 'mongodb': 'database',
  'mongoose': 'database', 'redis': 'database', '@prisma/client': 'database',
  'typeorm': 'database',
  'jest': 'devops', 'eslint': 'devops', 'prettier': 'devops',
  'webpack': 'devops', 'vite': 'devops', 'typescript': 'devops',
  'axios': 'integrations', 'graphql': 'integrations', 'stripe': 'integrations',
  'jsonwebtoken': 'integrations', 'passport': 'integrations',
  'nodemailer': 'integrations', 'aws-sdk': 'integrations',
};

function classifyDep(dep) {
  const low = (dep || '').toLowerCase();
  if (TECH_MAP_EXACT[low]) return TECH_MAP_EXACT[low];
  for (const [cat, keys] of Object.entries(PKG_DEP_MAP)) {
    if (keys.some(k => low.includes(k))) return cat;
  }
  return null;
}

function relativeTime(ts, t) {
  if (!ts) return '';
  const diff = Math.max(0, (Date.now() - ts) / 1000);
  if (diff < 60)    return t('เมื่อสักครู่');
  if (diff < 3600)  return t('{n} นาทีที่แล้ว',   { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('{n} ชั่วโมงที่แล้ว', { n: Math.floor(diff / 3600) });
  const d = new Date(ts);
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

export {
  SEED_PEOPLE, SEED_ACTIVITIES, SEED_PROJECTS, SEED_EDIT_HISTORY,
  TECH_ICONS, USER_GROUP_EN,
  EMOJI_OPTIONS, ENVIRONMENT_OPTIONS, DEFAULT_CATEGORIES, DEFAULT_API_TYPES,
  DEFAULT_ARCHITECTURES, DEFAULT_AUDIENCES, STATUS_OPTIONS,
  PKG_DEP_MAP, TECH_MAP_EXACT, classifyDep, relativeTime,
};
