import React from 'react'
import { Edit2, Trash2, Package } from '../../utils/Icons'
import { StatusDot } from '../StatusDot/StatusDot'

const TYPE_FILTERS = [
{ id: 'all', th: 'ทั้งหมด', en: 'All' },
{ id: 'พัฒนาเอง', th: 'DEV เอง', en: 'In-house' },
{ id: 'จ้างพัฒนา', th: 'จ้างพัฒนา', en: 'Outsourced' }];

const ProjectTile = ({ project, currentUserName, t, onOpen, onEdit, onDelete }) => {
  const isDev = project.type === 'พัฒนาเอง';
  const [hover, setHover] = React.useState(false);
  const subtitle = project.subtitle;
  const canEdit = currentUserName && Object.entries(project.team || {}).some(
    ([key, val]) => key !== 'roles' && Array.isArray(val) && val.includes(currentUserName)
  );

  return (
    <div className="relative flex flex-col items-center" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover && canEdit &&
      <div className="absolute -top-2 -right-2 z-20 flex gap-1">
          <button onClick={(e) => {e.stopPropagation();onEdit();}} className="w-7 h-7 bg-white border border-brand-200 rounded-full shadow-md hover:bg-brand-50 flex items-center justify-center transition-colors">
            <Edit2 size={12} className="text-brand-600" />
          </button>
          <button onClick={(e) => {e.stopPropagation();onDelete();}} className="w-7 h-7 bg-white border border-red-200 rounded-full shadow-md hover:bg-red-50 flex items-center justify-center transition-colors">
            <Trash2 size={12} className="text-red-600" />
          </button>
        </div>
      }
      <button onClick={onOpen} className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-1">
        <div className={`relative w-28 h-28 rounded-3xl flex flex-col items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow overflow-hidden ${isDev ? 'text-white' : 'bg-white border-2 border-brand-200'}`} style={isDev && !project.image ? { background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)' } : project.image ? {} : {}}>
          {project.image ?
          <>
              <img src={project.image} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
              <p className="absolute bottom-1.5 left-0 right-0 text-center text-xs font-bold text-white tracking-wide drop-shadow">{project.name}</p>
              {project.status && <StatusDot status={project.status} className="absolute top-1.5 right-1.5" />}
            </> :

          <>
              <div className="mb-1 flex flex-col items-center">
                <span className={`text-base font-bold leading-tight ${isDev ? 'text-white' : 'text-brand-700'}`}>RVP</span>
                <span className={`text-[11px] font-light ${isDev ? 'text-white/80' : ''}`} style={isDev ? {} : { color: 'var(--accent-600)' }}>Library</span>
              </div>
              <p className={`text-sm font-bold ${isDev ? 'text-white' : 'text-brand-700'}`}>{project.name}</p>
              {subtitle && <p className={`text-[10px] ${isDev ? 'text-brand-100' : 'text-brand-500'}`}>({subtitle})</p>}
              {project.status && <StatusDot status={project.status} className="absolute top-1.5 right-1.5" />}
            </>
          }
        </div>
      </button>
      {hover &&
      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 w-64 pointer-events-none animate-fadeIn">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background: 'var(--brand-800)' }}></div>
          <div className="relative rounded-xl shadow-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)' }}>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">{project.name}</span>
              {subtitle &&
            <>
                  <span className="text-xs text-white/60">·</span>
                  <span className="text-xs text-white/80">{subtitle}</span>
                </>
            }
            </div>
            <p className="text-xs leading-relaxed text-white/90 mb-2">{project.desc}</p>
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/20">
              <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-md font-medium">{t(project.type)}</span>
              <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-md font-medium">{t(project.audience)}</span>
              {project.category &&
            <span className="px-2 py-0.5 bg-white/30 text-white text-[10px] rounded-md font-semibold inline-flex items-center gap-1">
                  <Package size={9} />{project.category}
                </span>
            }
              {project.environments?.length > 0 && project.environments.slice(0, 2).map((env) =>
            <span key={env} className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-md font-medium">{env}</span>
            )}
            </div>
          </div>
        </div>
      }
    </div>);

};

export { ProjectTile, TYPE_FILTERS }
