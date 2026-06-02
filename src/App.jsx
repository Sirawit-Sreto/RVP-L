import React from 'react'
import { useTweaks, TweaksPanel, TweakSection } from './components/TweaksPanel/TweaksPanel'
import { Activity } from './utils/Icons'
import { useT } from './utils/i18n'
import { SEED_ACTIVITIES, SEED_EDIT_HISTORY, DEFAULT_ARCHITECTURES, DEFAULT_AUDIENCES, DEFAULT_API_TYPES } from './data/seed-data'
import { projectsApi } from './api/projectsApi'
import { usersApi } from './api/usersApi'
import { LoginView } from './pages/login/login-page'
import { HomeView } from './pages/home/home-page'
import { DetailView } from './pages/detail/detail-page'
import { PersonDrawer } from './components/PersonDrawer/PersonDrawer'
import { ModalRouter, ConfirmDeleteDialog } from './components/Modal/ModalRouter'

// Main App — wires state, view routing, brand-color tweaks, and the audit log.
// Most CRUD goes through small wrapper helpers below so every add/edit/delete
// also writes an entry into editHistory and bumps lastEditAt on the affected project.

const BRAND_PALETTES = {
  purple: {
    label: 'Purple',
    25: '#FAF8FF', 50: '#F3EFFF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD',
    400: '#9F7AEA', 500: '#8B5CF6', 600: '#6B46C1', 700: '#553C9A', 800: '#4C1D95', 900: '#3C1361'
  },
  indigo: {
    label: 'Indigo',
    25: '#F5F7FF', 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
    400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#1E1B4B'
  },
  teal: {
    label: 'Teal',
    25: '#F0FDFA', 50: '#E5FBF6', 100: '#CCFBF1', 200: '#99F6E4', 300: '#5EEAD4',
    400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A'
  },
  rose: {
    label: 'Rose',
    25: '#FFF5F7', 50: '#FFE4E6', 100: '#FECDD3', 200: '#FDA4AF', 300: '#FB7185',
    400: '#FB7185', 500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337'
  },
  slate: {
    label: 'Slate',
    25: '#F8FAFC', 50: '#F1F5F9', 100: '#E2E8F0', 200: '#CBD5E1', 300: '#94A3B8',
    400: '#64748B', 500: '#475569', 600: '#334155', 700: '#1F2937', 800: '#111827', 900: '#0F172A'
  },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "brand": "purple"
}/*EDITMODE-END*/;

function applyBrand(name) {
  const palette = BRAND_PALETTES[name] || BRAND_PALETTES.purple;
  const root = document.documentElement;
  Object.entries(palette).forEach(([k, v]) => {
    if (k === 'label') return;
    root.style.setProperty(`--brand-${k}`, v);
  });
}

// Home filter chips — now filter by `audience` (the field that used to hold
// the old category list values: พนักงาน / ตัวแทน / …). The new `category`
// field stores architecture (Web App / Mobile App / …).
const FILTER_TABS = [
  { id: 'all',                labelKey: 'ทั้งหมด' },
  { id: 'พนักงาน',           labelKey: 'พนักงาน' },
  { id: 'ตัวแทน',             labelKey: 'ตัวแทน' },
  { id: 'บริษัทประกันภัย',   labelKey: 'บริษัทประกันภัย' },
  { id: 'สถานพยาบาล',       labelKey: 'สถานพยาบาล' },
  { id: 'ประชาชนทั่วไป',     labelKey: 'ประชาชนทั่วไป' },
];

// Drawer role-keys ↔ role labels (used when the user changes someone's role inline).
const ROLE_KEY_TO_LABEL = { pm: 'PM', sa: 'SA', uxui: 'UX/UI', dev: 'DEV', user: 'USER' };
const ROLE_LABEL_TO_KEY = { 'PM': 'pm', 'SA': 'sa', 'UX/UI': 'uxui', 'DEV': 'dev', 'USER': 'user' };

// Color palette for new user-defined team roles. Cycles by role index.
const ROLE_PALETTES = [
  { color: 'bg-rose-50 text-rose-700 border-rose-200',         hover: 'hover:bg-rose-100' },
  { color: 'bg-amber-50 text-amber-700 border-amber-200',      hover: 'hover:bg-amber-100' },
  { color: 'bg-pink-50 text-pink-700 border-pink-200',         hover: 'hover:bg-pink-100' },
  { color: 'bg-blue-50 text-blue-700 border-blue-200',         hover: 'hover:bg-blue-100' },
  { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', hover: 'hover:bg-emerald-100' },
  { color: 'bg-violet-50 text-violet-700 border-violet-200',   hover: 'hover:bg-violet-100' },
  { color: 'bg-cyan-50 text-cyan-700 border-cyan-200',         hover: 'hover:bg-cyan-100' },
  { color: 'bg-orange-50 text-orange-700 border-orange-200',   hover: 'hover:bg-orange-100' },
];

function App() {
  const [t_, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyBrand(t_.brand); }, [t_.brand]);

  // Auth state — login gates the app. `user` holds the signed-in identity.
  const [user, setUser] = React.useState(null);

  const [currentView, setCurrentView] = React.useState('home');
  const [selectedProjectId, setSelectedProjectId] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all'); // ทั้งหมด / พัฒนาเอง / จ้างพัฒนา
  const [archFilter, setArchFilter] = React.useState('all'); // หมวดหมู่ (สถาปัตยกรรม)
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [activityFilter, setActivityFilter] = React.useState('all');
  const [modal, setModal] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const [peopleData, setPeopleData] = React.useState({});
  const [activitiesData, setActivitiesData] = React.useState(SEED_ACTIVITIES);
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // โหลด projects + users จาก API
  React.useEffect(() => {
    Promise.all([projectsApi.getAll(), usersApi.getAll()])
      .then(([projs, users]) => {
        setProjects(projs);
        const peopleMap = {};
        users.forEach(u => {
          const name = `คุณ${u.user_firstname} ${u.user_lastname}`;
          peopleMap[name] = {
            name, position: u.position, dept: u.user_department,
            avatar: u.user_pic || '👤', email: u.email,
            slack: u.slack, phone: u.phone,
          };
        });
        setPeopleData(peopleMap);
      })
      .catch(err => console.error('API load error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Dynamic dropdowns — extensible by the user at runtime.
  //   • categories    → architecture options ("หมวดหมู่ (สถาปัตยกรรม)")
  //   • audiences     → user-group options ("ผู้ใช้งาน")
  //   • projectTypes  → project type options ("ประเภท" — was hard-coded)
  //   • apiTypes      → API integration types
  const [categories, setCategories] = React.useState(DEFAULT_ARCHITECTURES);
  const [audiences, setAudiences] = React.useState(DEFAULT_AUDIENCES);
  const [projectTypes, setProjectTypes] = React.useState(['พัฒนาเอง', 'จ้างพัฒนา']);
  const [apiTypes, setApiTypes] = React.useState(DEFAULT_API_TYPES);

  // Audit log — every add/edit/delete writes here.
  // Entry shape: { id, timestamp, action: 'add'|'edit'|'delete', target: <i18n key>, projectId, userName, details? }
  const [editHistory, setEditHistory] = React.useState(SEED_EDIT_HISTORY);

  // Expose peopleData so detail view can look up clickability.
  React.useEffect(() => { window.peopleData = peopleData; }, [peopleData]);
  // Expose activitiesData so the project audit-log section can aggregate
  // activities across all team members for the current project.
  React.useEffect(() => { window.__rvpActivitiesData = activitiesData; }, [activitiesData]);

  // Exposed helper so the team-members modal's "+ Add" button can swap itself
  // for the team-add form modal without prop-drilling setModal through everywhere.
  React.useEffect(() => {
    window.__rvpReopenTeamAdd = (projectId, role) => setModal({ type: 'team', mode: 'add', projectId, data: { role: role.key, roleLabel: role.label } });
    return () => { delete window.__rvpReopenTeamAdd; };
  }, []);

  const t = useT();
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // ── audit log helper ───────────────────────────────────────────────────────
  // Spec: { id, timestamp, action: 'add'|'edit'|'delete', target, projectId, userName }
  // We extend with an optional `details` field for the short suffix shown in the UI.
  // userName uses the signed-in user's email (set on login).
  const logEdit = React.useCallback((action, target, projectId = null, details = '') => {
    setEditHistory(prev => [{
      id: `log${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      action, target, projectId,
      userName: (typeof user === 'object' && user?.email) || 'Demo User',
      details,
    }, ...prev]);
    if (projectId) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, lastEditAt: Date.now() } : p));
    }
  }, [user]);

  // ── project mutation helpers ───────────────────────────────────────────────
  const updateProject = (id, updates) => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastEditAt: Date.now() } : p));
  const deleteProject = (id, name) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (selectedProjectId === id) { setCurrentView('home'); setSelectedProjectId(null); }
    logEdit('delete', 'โปรเจ็ค', null, name);
  };
  const addProject = (data) => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    // Auto-add creator to PM slot so they can edit the project immediately
    const creatorPm = user?.name ? [user.name] : [];
    const created = {
      id: newId,
      type: 'พัฒนาเอง', audience: 'พนักงาน',
      icon: '',
      ...data,
      team: { roles: [], pm: creatorPm },
      docs: [], apis: [], functions: [],
      techStack: { frontend: [], backend: [], database: [], devops: [], infrastructure: [], integrations: [] },
      lastEditAt: Date.now(),
      createdAt: Date.now(),
    };
    setProjects(prev => [...prev, created]);
    logEdit('add', 'โปรเจ็ค', newId, data.fullName || data.name);
  };

  // ── dynamic dropdown helpers ───────────────────────────────────────────────
  const addCategory    = (name) => setCategories(prev    => prev.includes(name) ? prev : [...prev, name]);
  const addAudience    = (name) => setAudiences(prev     => prev.includes(name) ? prev : [...prev, name]);
  const addProjectType = (name) => setProjectTypes(prev  => prev.includes(name) ? prev : [...prev, name]);
  const addApiType     = (name) => setApiTypes(prev      => prev.includes(name) ? prev : [...prev, name]);

  // ── modal-submit dispatcher (per type) ─────────────────────────────────────
  const handleModalSubmit = (data) => {
    const { type, mode, projectId, personName } = modal;

    if (type === 'project') {
      if (mode === 'add') addProject(data);
      else { updateProject(data.id, data); logEdit('edit', 'โปรเจ็ค', data.id, data.fullName || data.name); }
    }
    else if (type === 'function') {
      const proj = projects.find(p => p.id === projectId);
      if (mode === 'add') {
        updateProject(projectId, { functions: [...proj.functions, data.value] });
        logEdit('add', 'ฟังก์ชั่น', projectId, data.value);
      } else {
        const nf = [...proj.functions]; nf[modal.data.index] = data.value;
        updateProject(projectId, { functions: nf });
        logEdit('edit', 'ฟังก์ชั่น', projectId, data.value);
      }
    }
    else if (type === 'team') {
      // TeamForm batches: data.names is an array of one-or-many names.
      // For external people (Vendor/Contractor), data.newPerson carries
      // their profile — we register them in peopleData with external:true
      // so they're available on other projects too.
      const proj = projects.find(p => p.id === projectId);
      const role = modal.data.role;
      if (data.newPerson) {
        setPeopleData(prev => prev[data.newPerson.key] ? prev : { ...prev, [data.newPerson.key]: data.newPerson });
      }
      const incoming = Array.isArray(data.names) ? data.names : (data.name ? [data.name] : []);
      const newOnes = incoming.filter(n => n && !proj.team[role]?.includes(n));
      if (newOnes.length > 0) {
        updateProject(projectId, { team: { ...proj.team, [role]: [...(proj.team[role] || []), ...newOnes] } });
        newOnes.forEach(n => logEdit('add', 'ทีมงาน', projectId, `${modal.data.roleLabel}: ${n}`));
      }
    }
    else if (type === 'doc') {
      const proj = projects.find(p => p.id === projectId);
      if (mode === 'add') {
        updateProject(projectId, { docs: [...proj.docs, {
          id: `d${Date.now()}`,
          version: 1,
          history: [],
          createdAt: Date.now(),
          createdBy: user?.email || 'Demo User',
          lastEditedAt: Date.now(),
          lastEditedBy: user?.email || 'Demo User',
          ...data
        }] });
        logEdit('add', 'เอกสาร', projectId, data.name);
      } else {
        // Edit — bump version, stamp lastEditedAt/By, and if the name actually
        // changed, push the old name + previous editor + timestamp onto the
        // history stack (newest first) so the doc-history modal can show
        // who edited each version and when.
        const oldDoc = proj.docs.find(d => d.id === modal.data.id);
        const hasChanged = oldDoc && (
          (data.name && data.name !== oldDoc.name) ||
          (data.url !== undefined && data.url !== oldDoc.url)
        );
        const nextHistory = hasChanged
          ? [{
              name:     oldDoc.name,
              url:      oldDoc.url || '',
              editedAt: oldDoc.lastEditedAt || oldDoc.createdAt || Date.now(),
              editor:   oldDoc.lastEditedBy || oldDoc.createdBy || 'Demo User',
            }, ...(oldDoc.history || [])]
          : (oldDoc?.history || []);
        const nextVersion = hasChanged ? (oldDoc?.version || 1) + 1 : (oldDoc?.version || 1);
        updateProject(projectId, { docs: proj.docs.map(d => d.id === modal.data.id ? {
          ...d, ...data,
          version: nextVersion,
          history: nextHistory,
          lastEditedAt: Date.now(),
          lastEditedBy: user?.email || 'Demo User',
        } : d) });
        logEdit('edit', 'เอกสาร', projectId, data.name);
      }
    }
    else if (type === 'api') {
      const proj = projects.find(p => p.id === projectId);
      if (mode === 'add') {
        updateProject(projectId, { apis: [...proj.apis, { id: `api${Date.now()}`, ...data }] });
        logEdit('add', 'API', projectId, data.name);
      } else {
        updateProject(projectId, { apis: proj.apis.map(a => a.id === modal.data.id ? { ...a, ...data } : a) });
        logEdit('edit', 'API', projectId, data.name);
      }
    }
    else if (type === 'tech') {
      updateProject(projectId, { techStack: data });
      logEdit('edit', 'Tech Stack', projectId);
    }
    else if (type === 'activity') {
      const pa = activitiesData[projectId] || {};
      const pna = pa[personName] || [];
      if (mode === 'add') {
        setActivitiesData(prev => ({ ...prev, [projectId]: { ...pa, [personName]: [{ id: `act${Date.now()}`, ...data }, ...pna] } }));
        logEdit('add', 'Activity', projectId, data.title);
      } else {
        setActivitiesData(prev => ({ ...prev, [projectId]: { ...pa, [personName]: pna.map(a => a.id === modal.data.id ? { ...a, ...data } : a) } }));
        logEdit('edit', 'Activity', projectId, data.title);
      }
    }
    else if (type === 'person') {
      // Edit person profile (does NOT change the keyed name to avoid breaking team refs).
      const key = modal.personName;
      setPeopleData(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
      // Use current selected project (if any) for the audit log, else generic.
      logEdit('edit', 'ข้อมูล Person', selectedProjectId, data.name || key);
    }
    else if (type === 'role') {
      // Add a user-defined team role to this project. Generates a unique key,
      // assigns a color from ROLE_PALETTES based on the current role count, and
      // initializes an empty member array under that key.
      const projectId = modal.projectId;
      const proj = projects.find(p => p.id === projectId);
      if (proj) {
        const currentRoles = Array.isArray(proj.team?.roles) ? proj.team.roles : [];
        const palette = ROLE_PALETTES[currentRoles.length % ROLE_PALETTES.length];
        const key = `role_${Date.now()}`;
        const newRole = { key, label: data.label, icon: data.icon || '👤', color: palette.color, hover: palette.hover };
        updateProject(projectId, { team: { ...proj.team, roles: [...currentRoles, newRole], [key]: [] } });
        logEdit('add', 'ตำแหน่ง', projectId, data.label);
      }
    }

    setModal(null);
  };

  const handleConfirm = () => {
    const c = confirmDelete;
    if (c.type === 'project') deleteProject(c.id, c.name);
    else if (c.type === 'function') {
      const p = projects.find(p => p.id === c.projectId);
      updateProject(c.projectId, {
        functions: p.functions.filter((_, i) => i !== c.index)
      });
      logEdit('delete', 'ฟังก์ชั่น', c.projectId, c.name);
    }
    else if (c.type === 'team') {
      const p = projects.find(p => p.id === c.projectId);
      updateProject(c.projectId, { team: { ...p.team, [c.role]: p.team[c.role].filter(n => n !== c.name) } });
      logEdit('delete', 'ทีมงาน', c.projectId, c.label || c.name);
    }
    else if (c.type === 'doc') {
      const p = projects.find(p => p.id === c.projectId);
      updateProject(c.projectId, { docs: p.docs.filter(d => d.id !== c.id) });
      logEdit('delete', 'เอกสาร', c.projectId, c.name);
    }
    else if (c.type === 'api') {
      const p = projects.find(p => p.id === c.projectId);
      updateProject(c.projectId, { apis: p.apis.filter(a => a.id !== c.id) });
      logEdit('delete', 'API', c.projectId, c.name);
    }
    else if (c.type === 'activity') {
      setActivitiesData(prev => ({ ...prev, [c.projectId]: { ...prev[c.projectId], [c.personName]: prev[c.projectId][c.personName].filter(a => a.id !== c.id) } }));
      logEdit('delete', 'Activity', c.projectId, c.name);
    }
    else if (c.type === 'role') {
      // Delete a custom team role from a project. Removes it from team.roles
      // and drops its member-array bucket entirely (members assigned to it
      // are also removed).
      const p = projects.find(p => p.id === c.projectId);
      if (p) {
        const nextRoles = (p.team.roles || []).filter(r => r.key !== c.roleKey);
        const nextTeam = { ...p.team, roles: nextRoles };
        delete nextTeam[c.roleKey];
        updateProject(c.projectId, { team: nextTeam });
        logEdit('delete', 'ตำแหน่ง', c.projectId, c.name);
      }
    }
    setConfirmDelete(null);
  };

  // ── role-change handler from drawer ────────────────────────────────────────
  const handleChangeRole = (newRoleKey) => {
    if (!selectedPerson) return;
    const proj = projects.find(p => p.id === selectedPerson.projectId);
    if (!proj) return;
    const personName = selectedPerson.name;
    const oldRoleKey = selectedPerson.roleKey;
    if (oldRoleKey === newRoleKey) return;
    const nextTeam = { ...proj.team };
    if (oldRoleKey) nextTeam[oldRoleKey] = (nextTeam[oldRoleKey] || []).filter(n => n !== personName);
    nextTeam[newRoleKey] = [...(nextTeam[newRoleKey] || []), personName];
    updateProject(proj.id, { team: nextTeam });
    const newLabel = ROLE_KEY_TO_LABEL[newRoleKey] || newRoleKey.toUpperCase();
    setSelectedPerson({ ...selectedPerson, roleKey: newRoleKey, role: newLabel });
    logEdit('edit', 'ทีมงาน', proj.id, `${personName} → ${newLabel}`);
  };

  // Wrap person-click from detail view so we include the role-key (drawer needs it).
  const handlePersonClick = (info) => {
    const roleKey = ROLE_LABEL_TO_KEY[info.role] || 'dev';
    setSelectedPerson({ ...info, roleKey });
  };

  const closePerson = () => { setSelectedPerson(null); setActivityFilter('all'); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-25) 0%, var(--brand-100) 100%)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-brand-600 font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="font-sans antialiased">
        <LoginView
          t={t}
          onSignIn={(u) => { setUser(u); setCurrentView('home'); }}
        />
      </div>
    );
  }

  const handleSignOut = () => {
    setUser(null);
    setCurrentView('home');
    setSelectedProjectId(null);
    setSelectedPerson(null);
    setModal(null);
  };

  return (
    <div className="font-sans antialiased">
      {currentView === 'home' && (
        <HomeView
          projects={projects}
          t={t}
          user={user} onSignOut={handleSignOut}
          activeFilter={activeFilter} setActiveFilter={setActiveFilter}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          archFilter={archFilter} setArchFilter={setArchFilter}
          audiences={audiences} onAddAudience={addAudience}
          architectures={categories}
          onOpen={(id) => { setSelectedProjectId(id); setCurrentView('detail'); }}
          onEdit={(p) => setModal({ type: 'project', mode: 'edit', data: p })}
          onDelete={(p) => setConfirmDelete({ type: 'project', id: p.id, name: p.fullName })}
          onAdd={(type) => setModal({ type: 'project', mode: 'add', data: type ? { type } : {} })}
          currentUserName={user?.name}
        />
      )}
      {currentView === 'detail' && (
        <DetailView
          project={selectedProject}
          editHistory={editHistory}
          activitiesData={activitiesData}
          peopleData={peopleData}
          t={t}
          user={user} onSignOut={handleSignOut}
          onBack={() => setCurrentView('home')}
          onEditProject={() => setModal({ type: 'project', mode: 'edit', data: selectedProject })}
          onDeleteProject={() => setConfirmDelete({ type: 'project', id: selectedProject.id, name: selectedProject.fullName })}
          onModal={setModal}
          onConfirmDelete={setConfirmDelete}
          onPersonClick={handlePersonClick}
        />
      )}

      <PersonDrawer
        selectedPerson={selectedPerson}
        peopleData={peopleData} activitiesData={activitiesData} projects={projects}
        user={user}
        t={t}
        activityFilter={activityFilter} setActivityFilter={setActivityFilter}
        onClose={closePerson}
        onModal={setModal}
        onConfirmDelete={setConfirmDelete}
        onChangeRole={handleChangeRole}
      />

      <ModalRouter
        modal={modal} projects={projects} peopleData={peopleData}
        activitiesData={activitiesData}
        editHistory={editHistory}
        categories={categories} apiTypes={apiTypes} audiences={audiences} projectTypes={projectTypes}
        t={t}
        onClose={() => setModal(null)}
        onSubmit={handleModalSubmit}
        onAddCategory={addCategory}
        onAddApiType={addApiType}
        onAddAudience={addAudience}
        onAddProjectType={addProjectType}
        onPersonClick={handlePersonClick}
        onConfirmDelete={setConfirmDelete}
      />

      <ConfirmDeleteDialog
        confirmDelete={confirmDelete} t={t}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirm}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand color" />
        <div style={{ padding: '4px 0 8px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(BRAND_PALETTES).map(([key, p]) => {
              const active = t_.brand === key;
              return (
                <button
                  key={key}
                  onClick={() => setTweak('brand', key)}
                  title={p.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px 6px 6px',
                    borderRadius: 999,
                    border: active ? `2px solid ${p[600]}` : '1px solid rgba(0,0,0,0.1)',
                    background: active ? `${p[50]}` : '#fff',
                    cursor: 'pointer', fontSize: 12, fontWeight: 500,
                    color: active ? p[800] : '#475569'
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${p[400]} 0%, ${p[700]} 100%)`,
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}></span>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </TweaksPanel>
    </div>
  );
}

export default App
