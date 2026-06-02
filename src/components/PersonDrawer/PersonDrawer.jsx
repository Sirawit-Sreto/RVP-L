import React from 'react'
import { Activity, AlertCircle, Bug, Calendar, Clock, Edit2, Eye, FileText, GitBranch, Link2, Package, Pencil, Plus, Rocket, Sparkles, Trash2, Users, X, ICON_MAP } from '../../utils/Icons'

const ACTIVITY_TYPES = {
  deploy:   { icon: 'Rocket',       label: 'Deploy',   color: 'bg-emerald-100 text-emerald-700' },
  feature:  { icon: 'Sparkles',     label: 'Feature',  color: 'bg-purple-100 text-purple-700' },
  bug:      { icon: 'Bug',          label: 'Bug Fix',  color: 'bg-red-100 text-red-700' },
  refactor: { icon: 'GitBranch',    label: 'Refactor', color: 'bg-blue-100 text-blue-700' },
  doc:      { icon: 'FileText',     label: 'Document', color: 'bg-amber-100 text-amber-700' },
  review:   { icon: 'Eye',          label: 'Review',   color: 'bg-indigo-100 text-indigo-700' },
  meeting:  { icon: 'Users',        label: 'Meeting',  color: 'bg-pink-100 text-pink-700' },
  incident: { icon: 'AlertCircle',  label: 'Incident', color: 'bg-orange-100 text-orange-700' },
};

const DRAWER_ROLES = [
  { key: 'pm',   label: 'PM' },
  { key: 'sa',   label: 'SA' },
  { key: 'uxui', label: 'UX/UI' },
  { key: 'dev',  label: 'DEV' },
  { key: 'user', label: 'USER' },
];

function PersonDrawer({ selectedPerson, peopleData, activitiesData, projects, user, t, activityFilter, setActivityFilter, onClose, onModal, onConfirmDelete, onChangeRole }) {
  if (!selectedPerson) return null;
  const person = peopleData[selectedPerson.name];
  if (!person) return null;

  const allActivities = React.useMemo(() => {
    const pid  = selectedPerson.projectId;
    const proj = projects.find(p => p.id === pid);
    const list = (activitiesData[pid] || {})[selectedPerson.name] || [];
    return list.map(act => ({
      ...act,
      projectId:    pid,
      projectName:  proj ? proj.fullName : `Project #${pid}`,
      projectShort: proj?.name || `#${pid}`,
      projectType:  proj?.type || 'พัฒนาเอง',
    }));
  }, [activitiesData, selectedPerson.name, selectedPerson.projectId, projects]);

  const filteredActivities = activityFilter === 'all' ? allActivities : allActivities.filter(a => a.type === activityFilter);
  const stats = {
    total: allActivities.length,
    deploy: allActivities.filter(a => a.type === 'deploy').length,
    bug: allActivities.filter(a => a.type === 'bug').length,
    feature: allActivities.filter(a => a.type === 'feature').length,
  };
  const displayName     = person.name;
  const displayPosition = person.position;
  const displayDept     = person.dept;

  const canAddActivity = !!(user?.name && user.name === selectedPerson.name);

  const [editingRole, setEditingRole] = React.useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl overflow-y-auto animate-slideInRight" data-screen-label="Person drawer">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-stone-100 flex items-center justify-center z-10 shadow-md">
          <X size={20} className="text-stone-700" />
        </button>
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-8 pb-12">
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-5xl ring-2 ring-white/30 flex-shrink-0">{person.avatar}</div>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-2">
                {editingRole ? (
                  <select
                    autoFocus
                    value={selectedPerson.roleKey || 'dev'}
                    onChange={(e) => { onChangeRole(e.target.value); setEditingRole(false); }}
                    onBlur={() => setEditingRole(false)}
                    className="px-2.5 py-1 bg-white/95 text-stone-800 text-xs font-medium rounded-full outline-none cursor-pointer"
                  >
                    {DRAWER_ROLES.map(r => <option key={r.key} value={r.key}>{t(r.label)} {t('ในโปรเจ็คนี้')}</option>)}
                  </select>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full">
                    {selectedPerson.role} {t('ในโปรเจ็คนี้')}
                    <button
                      type="button"
                      onClick={() => setEditingRole(true)}
                      title={t('เปลี่ยน role')}
                      className="w-5 h-5 -mr-1 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <Pencil size={10} />
                    </button>
                  </span>
                )}
                {user?.email === person.email && (
                  <button
                    onClick={() => onModal({ type: 'person', mode: 'edit', personName: selectedPerson.name, data: person })}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-medium rounded-full transition-colors"
                  >
                    <Pencil size={10} />{t('แก้ไขโปรไฟล์')}
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
              <p className="text-white/90 text-sm">{displayPosition} · {displayDept}</p>
            </div>
          </div>
        </div>
        <div className="p-6 -mt-6">

          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-brand-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-brand-900">{stats.total}</p><p className="text-[10px] text-brand-600 uppercase tracking-wider mt-1">{t('ทั้งหมด')}</p></div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-emerald-700">{stats.deploy}</p><p className="text-[10px] text-emerald-600 uppercase tracking-wider mt-1">{t('Deploy')}</p></div>
            <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-amber-700">{stats.feature}</p><p className="text-[10px] text-amber-600 uppercase tracking-wider mt-1">{t('Feature')}</p></div>
            <div className="bg-red-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-red-700">{stats.bug}</p><p className="text-[10px] text-red-600 uppercase tracking-wider mt-1">{t('Bug Fix')}</p></div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-brand-900 flex items-center gap-2">
                <Activity size={16} />{t('ทำอะไร / อัพเดท / แก้อะไรไปบ้าง')}
              </h3>
              {canAddActivity && (
                <button onClick={() => onModal({ type: 'activity', mode: 'add', projectId: selectedPerson.projectId, personName: selectedPerson.name })} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
                  <Plus size={12} />{t('เพิ่ม')}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap mb-4">
              <button onClick={() => setActivityFilter('all')} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${activityFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-stone-700 border border-stone-200 hover:border-brand-300'}`}>{t('ทั้งหมด')}</button>
              {Object.entries(ACTIVITY_TYPES).map(([key, val]) => {
                const count = allActivities.filter(a => a.type === key).length;
                if (count === 0) return null;
                const IconComp = ICON_MAP[val.icon];
                return (
                  <button key={key} onClick={() => setActivityFilter(key)} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all ${activityFilter === key ? 'bg-brand-600 text-white' : 'bg-white text-stone-700 border border-stone-200 hover:border-brand-300'}`}>
                    <IconComp size={12} />{t(val.label)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative space-y-3">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 bg-stone-50 rounded-xl">
                <Activity size={32} className="text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-400">{t('ยังไม่มี activity')}</p>
              </div>
            ) : (
              <>
                <div className="absolute left-5 top-2 bottom-2 w-px bg-stone-200"></div>
                {filteredActivities.map(act => {
                  const cfg = ACTIVITY_TYPES[act.type] || ACTIVITY_TYPES.feature;
                  const IconComp = ICON_MAP[cfg.icon];
                  const actTitle = act.title;
                  const actDesc  = act.desc;
                  const actDate  = act.date;
                  const projTone = act.projectType === 'พัฒนาเอง'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200';
                  return (
                    <div key={`${act.projectId}-${act.id}`} className="flex gap-4 relative group">
                      <div className={`w-10 h-10 rounded-full ${cfg.color} flex items-center justify-center z-10 flex-shrink-0 ring-4 ring-white shadow-sm`}>
                        <IconComp size={16} />
                      </div>
                      <div className="flex-1 bg-white border border-stone-200 rounded-xl p-4 hover:border-brand-200 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <p className="font-semibold text-stone-900 text-sm leading-snug flex-1">{actTitle}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 ${cfg.color} text-[10px] rounded-md font-bold uppercase tracking-wider`}>{t(cfg.label)}</span>
                            {canAddActivity && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onModal({ type: 'activity', mode: 'edit', projectId: act.projectId, personName: selectedPerson.name, data: act })} className="w-6 h-6 rounded bg-brand-50 hover:bg-brand-100 flex items-center justify-center">
                                  <Edit2 size={12} className="text-brand-600" />
                                </button>
                                <button onClick={() => onConfirmDelete({ type: 'activity', projectId: act.projectId, personName: selectedPerson.name, id: act.id, name: actTitle })} className="w-6 h-6 rounded bg-red-50 hover:bg-red-100 flex items-center justify-center">
                                  <Trash2 size={12} className="text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed mb-3">{actDesc}</p>
                        <div className="flex items-center gap-3 flex-wrap text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                          <span className="inline-flex items-center gap-1"><Calendar size={12} />{actDate}</span>
                          <span className="inline-flex items-center gap-1"><Clock size={12} />{act.time}</span>
                          {act.version && <span className="inline-flex items-center gap-1 text-brand-600 font-medium"><GitBranch size={12} />{act.version}</span>}
                          {act.env && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${act.env === 'Production' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{act.env}</span>}
                          {act.ref && <span className="inline-flex items-center gap-1 text-brand-600 font-medium"><Link2 size={12} />{act.ref}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export { PersonDrawer, ACTIVITY_TYPES, DRAWER_ROLES }
