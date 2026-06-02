import React from 'react'
import { Activity, ArrowLeft, Calendar, Check, Clock, Edit2, GitBranch, History, Link2, Pencil, Plus, Search, Settings, Sparkles, Trash2, Users, X, ICON_MAP } from '../../utils/Icons'
import { relativeTime, USER_GROUP_EN, STATUS_OPTIONS, TECH_ICONS } from '../../data/seed-data'
import { ACTIVITY_TYPES } from '../../components/PersonDrawer/PersonDrawer'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { StatusDot } from '../../components/StatusDot/StatusDot'

// Project detail view + section helpers

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors">
    <Plus size={12} />{label}
  </button>
);

const EditBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 font-medium rounded-lg shadow-sm transition-colors">
    <Settings size={12} />{label}
  </button>
);

function DocCard({ doc, projectId, t, canEdit, onModal, onConfirmDelete }) {
  const version = doc.version || 1;
  const history = doc.history || [];
  const icon = doc.type === 'miro' ? '🗂️' : doc.type === 'excel' ? '📊' : doc.type === 'figma' ? '🎨' : '📄';

  const stop = (e, fn) => { e.stopPropagation(); fn?.(); };
  const openHistory = () => onModal({ type: 'doc-history', projectId, data: doc });

  return (
    <button
      type="button"
      onClick={openHistory}
      className="flex items-start gap-3 p-4 bg-brand-50 hover:bg-brand-100 rounded-xl group text-left transition-colors"
      title={t('ดูประวัติเวอร์ชัน')}
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-medium text-stone-800 break-all">{doc.name}</p>
          <span
            title={t('แก้ไขแล้ว {n} ครั้ง', { n: Math.max(0, version - 1) })}
            className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-brand-200 text-brand-800 flex-shrink-0"
          >
            v{version}
          </span>
        </div>
        <p className="text-xs text-brand-500 uppercase mt-0.5">{doc.type}</p>
      </div>
      {canEdit && (
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <span
            role="button" tabIndex={0}
            onClick={(e) => stop(e, () => onModal({ type: 'doc', mode: 'edit', projectId, data: doc }))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') stop(e, () => onModal({ type: 'doc', mode: 'edit', projectId, data: doc })); }}
            className="w-7 h-7 rounded bg-white hover:bg-brand-100 flex items-center justify-center cursor-pointer"
          >
            <Edit2 size={12} className="text-brand-600" />
          </span>
          <span
            role="button" tabIndex={0}
            onClick={(e) => stop(e, () => onConfirmDelete({ type: 'doc', projectId, id: doc.id, name: doc.name }))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') stop(e, () => onConfirmDelete({ type: 'doc', projectId, id: doc.id, name: doc.name })); }}
            className="w-7 h-7 rounded bg-white hover:bg-red-100 flex items-center justify-center cursor-pointer"
          >
            <Trash2 size={12} className="text-red-600" />
          </span>
        </div>
      )}
    </button>
  );
}

function DocHistoryView({ doc, t, onClose }) {
  const version = doc.version || 1;
  const history = doc.history || [];
  const entries = [
    { name: doc.name, url: doc.url || '', editedAt: doc.lastEditedAt || doc.createdAt || null, editor: doc.lastEditedBy || doc.createdBy || 'Demo User', isCurrent: true, version },
    ...history.map((h, i) => ({ ...h, isCurrent: false, version: version - 1 - i })),
  ];
  return (
    <>
      <div className="flex items-center justify-between p-5 border-b border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-lg flex-shrink-0">
            {doc.type === 'miro' ? '🗂️' : doc.type === 'excel' ? '📊' : doc.type === 'figma' ? '🎨' : '📄'}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-brand-900 truncate">{doc.name}</h3>
            <p className="text-xs text-stone-500">{t('ประวัติเวอร์ชัน')} · {entries.length} {t('รายการ')}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center flex-shrink-0">
          <X size={16} className="text-stone-600" />
        </button>
      </div>
      <div className="p-5">
        <div className="relative">
          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-stone-200"></div>
          <ul className="space-y-3">
            {entries.map((e, i) => (
              <li key={i} className="relative flex items-start gap-3 pl-0">
                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-white ${e.isCurrent ? 'bg-brand-600 text-white' : 'bg-white border border-stone-300 text-stone-500'}`}>
                  {e.isCurrent ? <Check size={12} /> : <History size={12} />}
                </div>
                <div className={`flex-1 min-w-0 p-3 rounded-xl border ${e.isCurrent ? 'bg-brand-50 border-brand-200' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium ${e.isCurrent ? 'text-brand-900' : 'text-stone-700'}`}>{e.name}</p>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded flex-shrink-0 ${e.isCurrent ? 'bg-brand-600 text-white' : 'bg-stone-200 text-stone-600'}`}>v{e.version}</span>
                  </div>
                  {e.url && e.url !== '#' && (
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(ev) => ev.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-800 hover:underline truncate max-w-full mb-1.5"
                    >
                      <Link2 size={10} className="flex-shrink-0" />
                      <span className="truncate">{e.url}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                    {e.editor && (
                      <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                        <Pencil size={10} />{e.editor}
                      </span>
                    )}
                    {e.editedAt && (
                      <>
                        <span className="opacity-50">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={10} />{relativeTime(e.editedAt, t)}
                        </span>
                        <span className="text-stone-400">
                          ({new Date(e.editedAt).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })})
                        </span>
                      </>
                    )}
                    {e.isCurrent && <span className="ml-auto px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">{t('ปัจจุบัน')}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex gap-2 justify-end p-5 border-t border-stone-200 bg-stone-50 rounded-b-2xl">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors">{t('ปิด')}</button>
      </div>
    </>
  );
}

function resolveMemberName(name) {
  const person = window.peopleData?.[name];
  if (person) return person.name;
  return name;
}

const TEAM_MAX_VISIBLE = 4;
function TeamRoleCard({ role, members, t, projectId, projectName, onAddMember, onShowAll, onPersonClick, onConfirmDelete, onDeleteRole }) {
  const visible = members.slice(0, TEAM_MAX_VISIBLE);
  const hidden = Math.max(0, members.length - TEAM_MAX_VISIBLE);
  const peopleData = window.peopleData || {};

  return (
    <div className={`rounded-xl border-2 p-4 ${role.color} flex flex-col group/role relative`}>
      {onDeleteRole && (
        <button
          onClick={onDeleteRole}
          title={t('ลบตำแหน่ง')}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-red-200 hover:bg-red-50 shadow flex items-center justify-center opacity-0 group-hover/role:opacity-100 transition-opacity"
        >
          <Trash2 size={11} className="text-red-600" />
        </button>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="text-xl leading-none mt-0.5">{role.icon}</div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider leading-tight">{role.label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">
              {members.length === 0 ? t('ยังไม่มี') : `${members.length} ${t('คน')}`}
            </p>
          </div>
        </div>
        <button onClick={onAddMember} className="w-6 h-6 rounded bg-white hover:bg-brand-50 flex items-center justify-center shadow-sm flex-shrink-0" title={t('เพิ่ม')}>
          <Plus size={12} className="text-brand-600" />
        </button>
      </div>

      {members.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-2">
          <p className="text-[11px] italic opacity-50">—</p>
        </div>
      ) : (
        <>
          <div className="flex items-center -space-x-2 mb-2.5 flex-wrap gap-y-2">
            {visible.map((name, i) => {
              const person = peopleData[name];
              const isClickable = !!person && role.key !== 'user';
              const avatar = person?.avatar || (role.key === 'user' ? '👥' : (name?.[0] || '?'));
              const grad = person?.color || 'from-stone-400 to-stone-500';
              const common = `relative w-9 h-9 rounded-full bg-gradient-to-br ${grad} ring-2 ring-white flex items-center justify-center text-lg shadow-sm transition-transform`;
              if (isClickable) {
                return (
                  <button
                    key={i} title={resolveMemberName(name)}
                    onClick={() => onPersonClick({ name, projectId, projectName, role: role.label })}
                    className={`${common} hover:scale-110 cursor-pointer`}
                    style={{ zIndex: visible.length - i }}
                  >{avatar}</button>
                );
              }
              return (
                <div
                  key={i} title={resolveMemberName(name)}
                  className={common}
                  style={{ zIndex: visible.length - i }}
                >{avatar}</div>
              );
            })}
            {hidden > 0 && (
              <button
                onClick={onShowAll}
                title={t('ดูทั้งหมด')}
                className="relative w-9 h-9 rounded-full bg-white ring-2 ring-white border border-stone-200 flex items-center justify-center text-[11px] font-bold text-stone-600 hover:bg-stone-50 shadow-sm"
                style={{ zIndex: 0 }}
              >
                +{hidden}
              </button>
            )}
          </div>

          <button
            onClick={onShowAll}
            className="text-[11px] font-semibold underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100 self-start"
          >
            {t('ดูทั้งหมด')} ({members.length}) →
          </button>
        </>
      )}
    </div>
  );
}

function TeamMembersList({ role, members, projectId, projectName, t, onAddMember, onPersonClick, onConfirmDelete, onClose }) {
  const [query, setQuery] = React.useState('');
  const peopleData = window.peopleData || {};
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(name => {
      const display = resolveMemberName(name);
      const person = peopleData[name];
      return [name, display, person?.position, person?.dept]
        .filter(Boolean).some(s => String(s).toLowerCase().includes(q));
    });
  }, [members, query, role.key]);

  return (
    <>
      <div className="flex items-center justify-between p-5 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${role.color} border-2 flex items-center justify-center text-xl`}>{role.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-brand-900">{role.label} {t('ทั้งหมด')}</h3>
            <p className="text-xs text-stone-500">{members.length} {t('คน')} · {projectName}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center">
          <X size={16} className="text-stone-600" />
        </button>
      </div>

      <div className="p-5">
        {members.length > 6 && (
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('ค้นหาในทีม...')}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-brand-400 outline-none"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            <Users size={28} className="mx-auto mb-2 text-stone-300" />
            <p className="text-sm">{query ? t('ไม่พบสมาชิกที่ค้นหา') : t('ยังไม่มี')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
            {filtered.map((name, i) => {
              const person = peopleData[name];
              const isClickable = !!person && role.key !== 'user';
              const display = resolveMemberName(name);
              const sub = person?.position || '';
              const avatar = person?.avatar || (role.key === 'user' ? '👥' : (name?.[0] || '?'));
              const grad = person?.color || 'from-stone-400 to-stone-500';
              return (
                <div key={`${name}-${i}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}>
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isClickable ? (
                      <button
                        onClick={() => { onClose(); onPersonClick({ name, projectId, projectName, role: role.label }); }}
                        className="text-sm font-medium text-stone-900 hover:text-brand-700 truncate text-left underline decoration-dotted underline-offset-2"
                      >{display}</button>
                    ) : (
                      <p className="text-sm font-medium text-stone-900 truncate">{display}</p>
                    )}
                    {sub && <p className="text-[11px] text-stone-500 truncate">{sub}</p>}
                  </div>
                  <button
                    onClick={() => onConfirmDelete({ type: 'team', projectId, role: role.key, name, label: display })}
                    className="w-7 h-7 rounded bg-white hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title={t('ลบ')}
                  >
                    <Trash2 size={12} className="text-red-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end p-5 border-t border-stone-200 bg-stone-50 rounded-b-2xl">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors">{t('ปิด')}</button>
        <button onClick={() => { onClose(); onAddMember(); }} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors">
          <Plus size={14} />{t('เพิ่ม')} {role.label}
        </button>
      </div>
    </>
  );
}

const SectionHeader = ({ title, onAdd, onEdit, t }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
      <span className="w-1 h-5 bg-brand-600 rounded-full"></span>{title}
    </h3>
    <div className="flex gap-2">
      {onAdd && <AddBtn onClick={onAdd} label={t('เพิ่ม')} />}
      {onEdit && <EditBtn onClick={onEdit} label={t('จัดการ')} />}
    </div>
  </div>
);

const AUDIT_ACTION_META = {
  add:    { icon: 'Plus',   tone: 'bg-emerald-50 text-emerald-600', verbKey: 'เพิ่ม {target}' },
  edit:   { icon: 'Edit2',  tone: 'bg-amber-50 text-amber-600',     verbKey: 'แก้ไข {target}' },
  delete: { icon: 'Trash2', tone: 'bg-red-50 text-red-600',         verbKey: 'ลบ {target}' },
};
function AuditEntry({ entry, t }) {
  const meta = AUDIT_ACTION_META[entry.action] || AUDIT_ACTION_META.edit;
  const IconComp = ICON_MAP[meta.icon];
  const userName = entry.userName || 'System';
  const peopleData = window.peopleData || {};
  const person = Object.values(peopleData).find(p => p.email === userName || p.name === userName);
  const displayName = person ? person.name : userName;
  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const grad = person?.color || 'from-brand-500 to-brand-700';

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
      <div className={`w-8 h-8 rounded-full ${meta.tone} flex items-center justify-center flex-shrink-0`}>
        <IconComp size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-800 leading-snug">
          <span className="inline-flex items-center gap-1 mr-1.5 px-1.5 py-0.5 bg-stone-100 rounded-md align-middle">
            <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
              {person?.avatar || initial}
            </span>
            <span className="text-[11px] font-medium text-stone-700">{displayName}</span>
          </span>
          {t(meta.verbKey, { target: t(entry.target) })}
          {entry.details && <span className="text-stone-500"> — {entry.details}</span>}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          {relativeTime(entry.timestamp, t)}
        </p>
      </div>
    </div>
  );
}

function ActivityHistorySection({ editHistory, projectId, t, onViewAll }) {
  const entries = (editHistory || []).filter(e => e.projectId === projectId);
  const preview = entries.slice(0, 5);
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-600 rounded-full"></span>
          🔔 {t('ประวัติการเคลื่อนไหว')}
        </h3>
        {entries.length > 5 && (
          <button onClick={onViewAll} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-200 text-brand-700 text-xs font-medium rounded-lg hover:bg-brand-50 transition-colors">
            <History size={12} />{t('ดูทั้งหมด')} ({entries.length})
          </button>
        )}
      </div>
      {preview.length === 0 ? (
        <div className="text-center py-10 text-stone-400">
          <History size={28} className="mx-auto mb-2 text-stone-300" />
          <p className="text-sm">{t('ยังไม่มีการเคลื่อนไหว')}</p>
          <p className="text-[11px] text-stone-400 mt-1">{t('ระบบจะบันทึกการเพิ่ม / แก้ไข / ลบ ข้อมูลในโปรเจ็คนี้โดยอัตโนมัติ')}</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {preview.map(e => <AuditEntry key={e.id} entry={e} t={t} />)}
        </div>
      )}
    </div>
  );
}

function AuditLogSection({ activitiesData, projectId, projectName, peopleData, t, onViewAll, onPersonClick }) {
  const aggregated = React.useMemo(() => {
    const byPerson = (activitiesData && activitiesData[projectId]) || {};
    const flat = [];
    Object.entries(byPerson).forEach(([personName, acts]) => {
      acts.forEach(a => flat.push({ ...a, personName }));
    });
    return flat;
  }, [activitiesData, projectId]);

  const preview = aggregated.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-600 rounded-full"></span>
          📜 {t('ประวัติการแก้ไขข้อมูล')}
        </h3>
        {aggregated.length > 5 && (
          <button onClick={onViewAll} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-200 text-brand-700 text-xs font-medium rounded-lg hover:bg-brand-50 transition-colors">
            <History size={12} />{t('ดูทั้งหมด')} ({aggregated.length})
          </button>
        )}
      </div>
      {preview.length === 0 ? (
        <div className="text-center py-10 text-stone-400">
          <Activity size={28} className="mx-auto mb-2 text-stone-300" />
          <p className="text-sm">{t('ยังไม่มีประวัติการแก้ไข')}</p>
          <p className="text-[11px] text-stone-400 mt-1">{t('เพิ่ม Activity ในส่วน "ทำอะไร / อัพเดท / แก้อะไรไปบ้าง" ของทีมงานแต่ละคน')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {preview.map((act, i) => <ProjectActivityRow key={`${act.personName}-${act.id}-${i}`} act={act} peopleData={peopleData} projectId={projectId} projectName={projectName} t={t} onPersonClick={onPersonClick} />)}
        </div>
      )}
    </div>
  );
}

function ProjectActivityRow({ act, peopleData, projectId, projectName, t, onPersonClick }) {
  const person = peopleData[act.personName];
  const cfg = (ACTIVITY_TYPES || {})[act.type] || { icon: 'Sparkles', label: 'Feature', color: 'bg-purple-100 text-purple-700' };
  const IconComp = ICON_MAP[cfg.icon];
  const title = act.title;
  const date  = act.date;
  const displayName = person ? person.name : act.personName;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group">
      <div className={`w-9 h-9 rounded-full ${cfg.color} flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm`}>
        {IconComp ? <IconComp size={14} /> : '✨'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${cfg.color}`}>{t(cfg.label)}</span>
          <p className="text-sm text-stone-800 leading-snug">{title}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
          {person ? (
            <button
              onClick={() => onPersonClick({ name: act.personName, projectId, projectName, role: t('DEV') })}
              className="inline-flex items-center gap-1 hover:text-brand-700"
            >
              <span className="text-xs">{person.avatar}</span>
              <span className="underline decoration-dotted underline-offset-2">{displayName}</span>
            </button>
          ) : (
            <span>{displayName}</span>
          )}
          <span className="opacity-50">·</span>
          <span className="inline-flex items-center gap-1"><Calendar size={10} />{date} {act.time && `· ${act.time}`}</span>
          {act.version && <span className="inline-flex items-center gap-1 text-brand-600 font-medium"><GitBranch size={10} />{act.version}</span>}
          {act.env && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${act.env === 'Production' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{act.env}</span>}
        </div>
      </div>
    </div>
  );
}

const ProjectBadge = ({ project, size = 'lg' }) => {
  const isDev = project.type === 'พัฒนาเอง';
  const dims = size === 'lg' ? 'w-32 h-32' : 'w-28 h-28';
  const subtitle = project.subtitle;
  if (project.image) {
    return (
      <div className={`relative ${dims} rounded-3xl overflow-hidden shadow-lg`}>
        <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/75 to-transparent"></div>
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-base font-bold text-white tracking-wide drop-shadow">{project.name}</p>
          {subtitle && <p className="text-[10px] text-white/85">({subtitle})</p>}
        </div>
        {project.status && <StatusDot status={project.status} className="absolute top-2 right-2" />}
      </div>
    );
  }
  return (
    <div className={`relative ${dims} rounded-3xl flex flex-col items-center justify-center shadow-lg ${isDev ? 'text-white' : 'bg-white border-2 border-brand-200'}`} style={isDev ? { background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)' } : {}}>
      <div className="mb-1 flex flex-col items-center">
        <span className={`text-base font-bold leading-tight ${isDev ? 'text-white' : 'text-brand-700'}`}>RVP</span>
        <span className={`text-[11px] font-light ${isDev ? 'text-white/80' : ''}`} style={isDev ? {} : { color: 'var(--accent-600)' }}>Library</span>
      </div>
      <p className={`text-base font-bold ${isDev ? 'text-white' : 'text-brand-700'}`}>{project.name}</p>
      {subtitle && <p className={`text-xs ${isDev ? 'text-brand-100' : 'text-brand-500'}`}>({subtitle})</p>}
      {project.status && <StatusDot status={project.status} className="absolute top-2 right-2" />}
    </div>
  );
};

function DetailView({ project: p, t, editHistory, activitiesData, peopleData: propPeopleData, user, onSignOut, onBack, onEditProject, onDeleteProject, onModal, onConfirmDelete, onPersonClick }) {
  if (!p) return null;
  const LEGACY_ROLES = [
    { key: 'pm',   label: 'PM',    icon: '🎯', color: 'bg-rose-50 text-rose-700 border-rose-200',         hover: 'hover:bg-rose-100' },
    { key: 'sa',   label: 'SA',    icon: '📐', color: 'bg-amber-50 text-amber-700 border-amber-200',      hover: 'hover:bg-amber-100' },
    { key: 'uxui', label: 'UX/UI', icon: '🎨', color: 'bg-pink-50 text-pink-700 border-pink-200',          hover: 'hover:bg-pink-100' },
    { key: 'dev',  label: 'DEV',   icon: '💻', color: 'bg-blue-50 text-blue-700 border-blue-200',          hover: 'hover:bg-blue-100' },
    { key: 'user', label: 'USER',  icon: '👥', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', hover: '' },
  ];
  const roleSource = Array.isArray(p.team?.roles) ? p.team.roles : LEGACY_ROLES;
  const roles = roleSource.map(r => ({ ...r, label: t(r.label) }));
  const TECH_BUILTIN_TITLES = { frontend: 'Front-end', backend: 'Back-end', database: 'Databases', devops: 'DevOps', infrastructure: 'Infrastructure', integrations: 'Integrations' };
  const techCats = (() => {
    const present = p.techStack || {};
    const builtin = Object.entries(TECH_BUILTIN_TITLES)
      .filter(([k]) => k in present)
      .map(([k, title]) => ({ key: k, title: t(title) }));
    const custom = Object.keys(present)
      .filter(k => !(k in TECH_BUILTIN_TITLES))
      .map(k => ({ key: k, title: k }));
    return [...builtin, ...custom];
  })();
  const functions = p.functions;
  const descText = p.desc;
  const fullName = p.fullName;

  const canEdit = React.useMemo(() => {
    if (!user?.name) return false;
    const team = p.team || {};
    return Object.entries(team).some(
      ([key, val]) => key !== 'roles' && Array.isArray(val) && val.includes(user.name)
    );
  }, [p.team, user?.name]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, var(--brand-25) 0%, var(--brand-50) 100%)' }} data-screen-label="Project detail">
      <Header t={t} user={user} onSignOut={onSignOut} />
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-900 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> {t('กลับหน้ารวมโปรเจ็ค')}
          </button>
        </div>

        <div className="rounded-2xl py-3 px-6 mb-6 text-center" style={{ background: 'linear-gradient(90deg, var(--brand-400) 0%, var(--brand-600) 100%)' }}>
          <h2 className="text-white text-lg font-semibold">{t(p.type === 'พัฒนาเอง' ? 'บริการของระบบ RVP — DEV เอง' : 'บริการของระบบ RVP — จ้างพัฒนา')}</h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
          <div className="flex gap-8">
            <div className="flex-shrink-0"><ProjectBadge project={p} size="lg" /></div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-xs text-brand-500 font-medium uppercase tracking-wider">{t('Project Name')}</p>
                  {canEdit && (
                    <button
                      onClick={onEditProject}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-brand-200 text-brand-700 text-xs font-medium rounded-lg hover:bg-brand-50 transition-colors shadow-sm"
                    >
                      <Edit2 size={12} />{t('แก้ไขโปรเจ็ค')}
                    </button>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-brand-900">{fullName}</h1>
              </div>
              <p className="text-stone-600 leading-relaxed">{descText}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-100">
                <div><p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">{t('ประเภท')}</p><p className="text-sm font-medium text-stone-800">{t(p.type)}</p></div>
                <div><p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">{t('ผู้ใช้งาน')}</p><p className="text-sm font-medium text-stone-800">{t(p.audience)}</p></div>
                <div><p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">{t('หมวดหมู่ (สถาปัตยกรรม)')}</p><p className="text-sm font-medium text-stone-800">{t(p.category)}</p></div>
                {p.status && (() => {
                  const s = STATUS_OPTIONS.find(o => o.id === p.status);
                  if (!s) return null;
                  return (
                    <div>
                      <p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">{t('สถานะ')}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${s.tone}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {s.th}
                      </span>
                    </div>
                  );
                })()}
                {p.dns && <div><p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">DNS</p><p className="text-sm font-mono text-brand-700">{p.dns}</p></div>}
                {p.vendor && <div><p className="text-xs text-brand-500 font-medium uppercase tracking-wider mb-1">{t('Vendor')}</p><p className="text-sm font-medium text-amber-700">{p.vendor}</p></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-600 rounded-full"></span>{t('ตำเเหน่งในทีม')}
            </h3>
            {canEdit && (
              <button
                onClick={() => onModal({ type: 'role', mode: 'add', projectId: p.id })}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                <Plus size={12} />{t('เพิ่มตำแหน่ง')}
              </button>
            )}
          </div>
          {roles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-brand-200 rounded-2xl bg-brand-25">
              <Users size={32} className="text-brand-300 mx-auto mb-3" />
              <p className="text-sm text-stone-600 mb-1">{t('ยังไม่มีตำแหน่งในทีม')}</p>
              <p className="text-xs text-stone-400 mb-4">{t('เพิ่มตำแหน่งเอง เช่น PM, QA, Designer, Developer')}</p>
              {canEdit && (
                <button
                  onClick={() => onModal({ type: 'role', mode: 'add', projectId: p.id })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={14} />{t('เพิ่มตำแหน่งแรก')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {roles.map(role => (
                <TeamRoleCard
                  key={role.key}
                  role={role}
                  members={p.team[role.key] || []}
                  t={t}
                  projectId={p.id} projectName={fullName}
                  onAddMember={canEdit ? () => onModal({ type: 'team', mode: 'add', projectId: p.id, data: { role: role.key, roleLabel: role.label } }) : undefined}
                  onShowAll={() => onModal({ type: 'team-members', projectId: p.id, projectName: fullName, data: { role: role.key, roleLabel: role.label, roleIcon: role.icon, roleColor: role.color, roleHover: role.hover, members: p.team[role.key] || [] } })}
                  onPersonClick={onPersonClick}
                  onConfirmDelete={onConfirmDelete}
                  onDeleteRole={canEdit && Array.isArray(p.team?.roles) ? () => onConfirmDelete({ type: 'role', projectId: p.id, roleKey: role.key, name: role.label, label: role.label }) : undefined}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
          <SectionHeader title={t('เอกสารและลิงก์ที่เกี่ยวข้อง')} onAdd={canEdit ? () => onModal({ type: 'doc', mode: 'add', projectId: p.id }) : undefined} t={t} />
          <div className="grid grid-cols-3 gap-3">
            {p.docs.map(d => <DocCard key={d.id} doc={d} projectId={p.id} t={t} canEdit={canEdit} onModal={onModal} onConfirmDelete={onConfirmDelete} />)}
            {p.docs.length === 0 && <p className="col-span-3 text-center py-8 text-stone-400 text-sm">{t('ยังไม่มีเอกสาร')}</p>}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
          <SectionHeader title={t('เชื่อมต่อ API')} onAdd={canEdit ? () => onModal({ type: 'api', mode: 'add', projectId: p.id }) : undefined} t={t} />
          <div className="space-y-2">
            {p.apis.map(a => (
              <div key={a.id} className="flex items-start justify-between p-4 bg-brand-50 rounded-xl group gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Link2 size={16} className="text-brand-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800">{a.name}</p>
                    {a.desc && <p className="text-xs text-stone-500 mt-1 leading-relaxed">{a.desc}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.type === 'External' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{a.type}</span>
                  {canEdit && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onModal({ type: 'api', mode: 'edit', projectId: p.id, data: a })} className="w-7 h-7 rounded bg-white hover:bg-brand-100 flex items-center justify-center">
                        <Edit2 size={12} className="text-brand-600" />
                      </button>
                      <button onClick={() => onConfirmDelete({ type: 'api', projectId: p.id, id: a.id, name: a.name })} className="w-7 h-7 rounded bg-white hover:bg-red-100 flex items-center justify-center">
                        <Trash2 size={12} className="text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {p.apis.length === 0 && <p className="text-center py-8 text-stone-400 text-sm">{t('ยังไม่มี API')}</p>}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8 mb-6">
          <SectionHeader title={t('Tech Stack')} onEdit={canEdit ? () => onModal({ type: 'tech', mode: 'edit', projectId: p.id, data: p.techStack }) : undefined} t={t} />
          {(() => {
            const filledCats = techCats.filter(cat => p.techStack[cat.key]?.length > 0);
            if (filledCats.length === 0) {
              return <p className="text-center py-8 text-stone-400 text-sm">{t('ยังไม่มี Tech Stack')}</p>;
            }
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filledCats.map(cat => (
                  <div key={cat.key}>
                    <h4 className="text-sm font-bold text-brand-900 mb-3 pb-2 border-b border-brand-100">{cat.title}</h4>
                    <div className="space-y-2">
                      {p.techStack[cat.key].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-base">{TECH_ICONS[item] || '⚙️'}</span>
                          <span className="text-stone-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <AuditLogSection
          activitiesData={activitiesData}
          projectId={p.id}
          projectName={fullName}
          peopleData={propPeopleData || {}}
          t={t}
          onPersonClick={onPersonClick}
          onViewAll={() => onModal({ type: 'audit', projectId: p.id, projectName: fullName })}
        />

        <ActivityHistorySection
          editHistory={editHistory}
          projectId={p.id}
          t={t}
          onViewAll={() => onModal({ type: 'edit-history', projectId: p.id, projectName: fullName })}
        />
      </div>
      <Footer t={t} />
    </div>
  );
}

export { DetailView, ProjectBadge, SectionHeader, AddBtn, EditBtn, AuditLogSection, ActivityHistorySection, AuditEntry, ProjectActivityRow, TeamRoleCard, TeamMembersList, resolveMemberName, DocCard, DocHistoryView }
