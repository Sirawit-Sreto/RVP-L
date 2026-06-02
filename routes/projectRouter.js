const express = require('express');
const router = express.Router();
const db = require('../db');

// helper: parse JSON string หรือ return fallback
function tryParse(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

// แปลง DB row → frontend project shape
async function buildProject(p) {
  const pid = p.project_id;

  const [members, funcs, docs, apis] = await Promise.all([
    db.query(`SELECT tm.*, u.user_firstname, u.user_lastname, u.user_pic, u.email
              FROM team_members tm
              LEFT JOIN users u ON tm.user_id = u.user_id
              WHERE tm.project_id = $1`, [pid]),
    db.query(`SELECT * FROM project_functions WHERE project_id = $1 ORDER BY func_id`, [pid]),
    db.query(`SELECT * FROM documents WHERE project_id = $1 ORDER BY created_at`, [pid]),
    db.query(`SELECT * FROM api_connections WHERE project_id = $1 ORDER BY api_id`, [pid]),
  ]);

  // สร้าง team object { pm:[], sa:[], uxui:[], dev:[], user:[], roles:[] }
  const team = { roles: [] };
  for (const m of members.rows) {
    const key = m.role_name.toLowerCase();
    if (!team[key]) team[key] = [];
    const name = m.user_id
      ? `คุณ${m.user_firstname} ${m.user_lastname}`
      : m.user_group_name || 'บุคคลภายนอก';
    if (!team[key].includes(name)) team[key].push(name);
  }

  return {
    id:          p.project_id,
    name:        p.short_name || p.project_name,
    fullName:    p.project_name,
    icon:        p.project_pic || '',
    image:       '',
    category:    p.category_name || '',
    type:        p.type_name    || 'พัฒนาเอง',
    audience:    p.audience     || '',
    status:      p.status_name  || 'develop',
    dns:         p.dns          || '',
    vendor:      p.vendor       || '',
    desc:        p.description  || '',
    link_name:   p.link_name    || '',
    link_path:   p.link_path    || '',
    functions:   funcs.rows.map(f => f.func_text),
    team,
    docs: docs.rows.map(d => ({
      id:           d.doc_id,
      name:         d.name,
      url:          d.url,
      type:         d.type,
      version:      d.version,
      createdAt:    d.created_at,
      createdBy:    d.created_by,
      lastEditedAt: d.last_edited_at,
      lastEditedBy: d.last_edited_by,
      history:      tryParse(d.history, []),
    })),
    apis: apis.rows.map(a => ({ id: a.api_id, name: a.name, type: a.type, desc: a.description })),
    techStack: {
      frontend:       tryParse(p.frontend),
      backend:        tryParse(p.backend),
      database:       tryParse(p.database),
      devops:         tryParse(p.devops),
      infrastructure: tryParse(p.infrastructure),
      integrations:   tryParse(p.integrations),
    },
    environments: tryParse(p.environments, []),
    lastEditAt:   p.update_at   ? new Date(p.update_at).getTime()   : null,
    createdAt:    p.created_at  ? new Date(p.created_at).getTime()  : null,
    is_deleted:   p.is_deleted,
  };
}

// GET /api/projects — all projects with full data
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*,
        s.status_name,
        t.type_name,
        c.category_name,
        cfg.config_name AS audience
      FROM projects p
      LEFT JOIN status   s   ON p.status_id   = s.status_id
      LEFT JOIN types    t   ON p.type_id     = t.type_id
      LEFT JOIN category c   ON p.category_id = c.category_id
      LEFT JOIN config   cfg ON p.config_id   = cfg.config_id
      WHERE p.is_deleted = false
      ORDER BY p.project_id DESC
    `);
    const projects = await Promise.all(rows.map(buildProject));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:id — single project
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*,
        s.status_name,
        t.type_name,
        c.category_name,
        cfg.config_name AS audience
      FROM projects p
      LEFT JOIN status   s   ON p.status_id   = s.status_id
      LEFT JOIN types    t   ON p.type_id     = t.type_id
      LEFT JOIN category c   ON p.category_id = c.category_id
      LEFT JOIN config   cfg ON p.config_id   = cfg.config_id
      WHERE p.project_id = $1 AND p.is_deleted = false
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(await buildProject(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — create
router.post('/', async (req, res) => {
  const { fullName, name, icon, status, type, audience, category, dns, vendor, desc,
          link_name, link_path, techStack, environments } = req.body;
  try {
    const statusRow  = await db.query(`SELECT status_id  FROM status   WHERE status_name  = $1`, [status  || 'develop']);
    const typeRow    = await db.query(`SELECT type_id    FROM types    WHERE type_name    = $1`, [type    || 'พัฒนาเอง']);
    const catRow     = await db.query(`SELECT category_id FROM category WHERE category_name = $1`, [category || '']);
    const configRow  = await db.query(`SELECT config_id  FROM config   WHERE config_name  = $1 AND group_choice = 'audience'`, [audience || '']);

    const ts = techStack || {};
    const { rows } = await db.query(`
      INSERT INTO projects
        (project_name, short_name, project_pic, status_id, type_id, category_id, config_id,
         dns, vendor, description, link_name, link_path,
         frontend, backend, database, devops, infrastructure, integrations, environments)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING *
    `, [
      fullName, name || fullName, icon || '',
      statusRow.rows[0]?.status_id   || null,
      typeRow.rows[0]?.type_id       || null,
      catRow.rows[0]?.category_id    || null,
      configRow.rows[0]?.config_id   || null,
      dns || '', vendor || '', desc || '', link_name || '', link_path || '',
      JSON.stringify(ts.frontend       || []),
      JSON.stringify(ts.backend        || []),
      JSON.stringify(ts.database       || []),
      JSON.stringify(ts.devops         || []),
      JSON.stringify(ts.infrastructure || []),
      JSON.stringify(ts.integrations   || []),
      JSON.stringify(environments      || []),
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/projects/:id — update
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { fullName, name, icon, status, type, audience, category, dns, vendor, desc,
          link_name, link_path, techStack, environments } = req.body;
  try {
    const statusRow = await db.query(`SELECT status_id  FROM status   WHERE status_name  = $1`, [status]);
    const typeRow   = await db.query(`SELECT type_id    FROM types    WHERE type_name    = $1`, [type]);
    const catRow    = await db.query(`SELECT category_id FROM category WHERE category_name = $1`, [category]);
    const configRow = await db.query(`SELECT config_id  FROM config   WHERE config_name  = $1 AND group_choice = 'audience'`, [audience]);

    const ts = techStack || {};
    const { rows } = await db.query(`
      UPDATE projects SET
        project_name=$1, short_name=$2, project_pic=$3,
        status_id=$4, type_id=$5, category_id=$6, config_id=$7,
        dns=$8, vendor=$9, description=$10, link_name=$11, link_path=$12,
        frontend=$13, backend=$14, database=$15, devops=$16, infrastructure=$17,
        integrations=$18, environments=$19, update_at=NOW()
      WHERE project_id=$20
      RETURNING *
    `, [
      fullName, name || fullName, icon || '',
      statusRow.rows[0]?.status_id   || null,
      typeRow.rows[0]?.type_id       || null,
      catRow.rows[0]?.category_id    || null,
      configRow.rows[0]?.config_id   || null,
      dns || '', vendor || '', desc || '', link_name || '', link_path || '',
      JSON.stringify(ts.frontend       || []),
      JSON.stringify(ts.backend        || []),
      JSON.stringify(ts.database       || []),
      JSON.stringify(ts.devops         || []),
      JSON.stringify(ts.infrastructure || []),
      JSON.stringify(ts.integrations   || []),
      JSON.stringify(environments      || []),
      id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
