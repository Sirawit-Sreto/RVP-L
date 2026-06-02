import React from 'react'
import { History, Trash2 } from '../../utils/Icons'
import {
  ProjectForm, FunctionForm, TeamForm, DocForm, ApiForm, TechForm,
  ActivityForm, PersonForm, RoleForm, ModalHeader
} from '../Forms/Forms'
import { AuditEntry, TeamMembersList, ProjectActivityRow, DocHistoryView } from '../../pages/detail/detail-page'

// Modal router + Confirm-delete dialog + Audit-log full-view modal.

function ModalRouter({ modal, projects, peopleData, activitiesData, editHistory, categories, apiTypes, audiences, projectTypes, t, onClose, onSubmit, onAddCategory, onAddApiType, onAddAudience, onAddProjectType, onPersonClick, onConfirmDelete }) {
  if (!modal) return null;

  if (modal.type === 'edit-history') {
    const entries = (editHistory || []).filter(e => e.projectId === modal.projectId);
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn" onClick={onClose} />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            <ModalHeader title={`🔔 ${t('ประวัติการเคลื่อนไหว')} (${entries.length})`} onClose={onClose} />
            <div className="flex-1 overflow-y-auto p-3">
              {entries.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <History size={32} className="mx-auto mb-2 text-stone-300" />
                  <p className="text-sm">{t('ยังไม่มีการเคลื่อนไหว')}</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {entries.map(e => <AuditEntry key={e.id} entry={e} t={t} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (modal.type === 'doc-history') {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn" onClick={onClose} />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            <DocHistoryView doc={modal.data} t={t} onClose={onClose} />
          </div>
        </div>
      </>
    );
  }

  if (modal.type === 'team-members') {
    const role = { key: modal.data.role, label: modal.data.roleLabel, icon: modal.data.roleIcon, color: modal.data.roleColor };
    const project = projects.find(p => p.id === modal.projectId);
    const members = project ? (project.team[role.key] || []) : modal.data.members;
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn" onClick={onClose} />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            <TeamMembersList
              role={role}
              members={members}
              projectId={modal.projectId}
              projectName={modal.projectName}
              t={t}
              onAddMember={() => { window.__rvpReopenTeamAdd?.(modal.projectId, role); }}
              onPersonClick={onPersonClick}
              onConfirmDelete={onConfirmDelete}
              onClose={onClose}
            />
          </div>
        </div>
      </>
    );
  }

  if (modal.type === 'audit') {
    const acts = (activitiesData && activitiesData[modal.projectId]) || {};
    const flat = [];
    Object.entries(acts).forEach(([personName, list]) => list.forEach(a => flat.push({ ...a, personName })));
    return (
      <>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn" onClick={onClose} />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            <ModalHeader title={`📜 ${t('ประวัติการแก้ไขข้อมูล')} (${flat.length})`} onClose={onClose} />
            <div className="flex-1 overflow-y-auto p-3">
              {flat.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <History size={32} className="mx-auto mb-2 text-stone-300" />
                  <p className="text-sm">{t('ยังไม่มีประวัติการแก้ไข')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {flat.map((act, i) => (
                    <ProjectActivityRow
                      key={`${act.personName}-${act.id}-${i}`}
                      act={act}
                      peopleData={peopleData}
                      projectId={modal.projectId}
                      projectName={modal.projectName || ''}
                      t={t}
                      onPersonClick={(info) => { onClose(); onPersonClick?.(info); }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto animate-scaleIn">
          {modal.type === 'project'  && <ProjectForm  initialData={modal.data} mode={modal.mode} onSubmit={onSubmit} onClose={onClose} t={t} categories={categories} onAddCategory={onAddCategory} audiences={audiences} onAddAudience={onAddAudience} projectTypes={projectTypes} onAddProjectType={onAddProjectType} />}
          {modal.type === 'function' && <FunctionForm initialData={modal.data} mode={modal.mode} onSubmit={onSubmit} onClose={onClose} t={t} />}
          {modal.type === 'team'     && (() => {
            const proj = projects.find(p => p.id === modal.projectId);
            const existing = proj?.team?.[modal.data.role] || [];
            return <TeamForm roleLabel={modal.data.roleLabel} peopleData={peopleData} existingMembers={existing} onSubmit={onSubmit} onClose={onClose} t={t} />;
          })()}
          {modal.type === 'doc'      && <DocForm      initialData={modal.data} mode={modal.mode} onSubmit={onSubmit} onClose={onClose} t={t} />}
          {modal.type === 'api'      && <ApiForm      initialData={modal.data} mode={modal.mode} onSubmit={onSubmit} onClose={onClose} t={t} apiTypes={apiTypes} onAddApiType={onAddApiType} />}
          {modal.type === 'tech'     && <TechForm     initialData={modal.data} onSubmit={onSubmit} onClose={onClose} t={t} />}
          {modal.type === 'activity' && <ActivityForm initialData={modal.data} mode={modal.mode} onSubmit={onSubmit} onClose={onClose} t={t} />}
          {modal.type === 'person'   && <PersonForm   initialData={modal.data} onSubmit={onSubmit} onClose={onClose} t={t} />}
          {modal.type === 'role'     && <RoleForm     initialData={modal.data} onSubmit={onSubmit} onClose={onClose} t={t} />}
        </div>
      </div>
    </>
  );
}

function ConfirmDeleteDialog({ confirmDelete, t, onClose, onConfirm }) {
  if (!confirmDelete) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto p-6 animate-scaleIn">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">{t('ยืนยันการลบ')}</h3>
              <p className="text-sm text-stone-600">"<strong>{confirmDelete.name}</strong>"</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">{t('ยกเลิก')}</button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-1.5">
              <Trash2 size={14} />{t('ลบ')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { ModalRouter, ConfirmDeleteDialog }
