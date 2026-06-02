import React from 'react'
import { Plus, Search, ChevronDown, ChevronUp, X } from '../../utils/Icons'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { ProjectTile, TYPE_FILTERS } from '../../components/ProjectTile/ProjectTile'
import { FilterDropdown } from '../../components/FilterDropdown/FilterDropdown'

const DEFAULT_VISIBLE = 10;

function HomeView({ projects, t, user, currentUserName, onSignOut, activeFilter, setActiveFilter, typeFilter, setTypeFilter, archFilter, setArchFilter, audiences, architectures, onAddAudience, onOpen, onEdit, onDelete, onAdd }) {
  const [expanded, setExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.
    filter((p) => typeFilter === 'all' || p.type === typeFilter).
    filter((p) => activeFilter === 'all' || p.audience === activeFilter).
    filter((p) => archFilter === 'all' || p.category === archFilter).
    filter((p) => {
      if (!q) return true;
      return [p.name, p.fullName, p.subtitle, p.desc, p.category, p.audience, p.dns, p.vendor].
      filter(Boolean).some((s) => String(s).toLowerCase().includes(q));
    }).
    slice().
    sort((a, b) => {
      const aRecent = Math.max(a.lastEditAt || 0, a.createdAt || 0);
      const bRecent = Math.max(b.lastEditAt || 0, b.createdAt || 0);
      return bRecent - aRecent;
    });
  }, [projects, typeFilter, activeFilter, archFilter, searchQuery]);

  const visible = expanded ? filtered : filtered.slice(0, DEFAULT_VISIBLE);
  const hasMore = filtered.length > DEFAULT_VISIBLE;

  const addType = typeFilter === 'all' ? undefined : typeFilter;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, var(--brand-25) 0%, var(--brand-50) 100%)', fontSize: "15px" }}>
      <Header t={t} user={user} onSignOut={onSignOut} />
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <section className="mb-12" data-screen-label="Home / All projects">
          <div className="rounded-2xl py-3 px-4 mb-6 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(90deg, var(--brand-400) 0%, var(--brand-600) 100%)' }}>
            <div className="flex-shrink-0">
              <div className="inline-flex bg-white/15 backdrop-blur-sm rounded-full p-0.5 border border-white/20">
                {TYPE_FILTERS.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => {setTypeFilter(tab.id);setExpanded(false);}}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${typeFilter === tab.id ? 'bg-white text-brand-700 shadow-sm' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>

                    {tab.th}
                  </button>
                )}
              </div>
            </div>
            <h2 className="text-white text-lg font-semibold whitespace-nowrap flex-1 text-center" style={{ height: "28px", width: "700px", letterSpacing: "1px", fontSize: "18px", lineHeight: "1.8" }}>{t('บริการของระบบ RVP')}</h2>
            <button onClick={() => onAdd(addType)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-brand-700 text-xs font-medium rounded-lg shadow-sm hover:bg-brand-50 transition-colors whitespace-nowrap flex-shrink-0">
              <Plus size={14} />{t('เพิ่มโปรเจ็ค')}
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-stretch gap-2 w-full max-w-2xl flex-wrap md:flex-nowrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value);setExpanded(false);}}
                  placeholder={t('ค้นหาโปรเจ็ค...')}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-brand-200 rounded-full shadow-sm placeholder-brand-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all" />

                {searchQuery &&
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-brand-100 hover:bg-brand-200 text-brand-700 flex items-center justify-center transition-colors"
                  title={t('ล้าง')}>

                    <X size={12} />
                  </button>
                }
              </div>
              <FilterDropdown
                audiences={audiences}
                architectures={architectures || []}
                audienceValue={activeFilter}
                archValue={archFilter}
                onAudienceChange={(v) => { setActiveFilter(v); setExpanded(false); }}
                onArchChange={(v) => { setArchFilter(v); setExpanded(false); }}
                t={t}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-5 max-w-5xl mx-auto">
            {visible.map((p) => <ProjectTile key={p.id} project={p} currentUserName={currentUserName} t={t} onOpen={() => onOpen(p.id)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />)}
            {filtered.length === 0 && <div className="col-span-5 text-center py-12 text-stone-400">{t('ไม่มีโปรเจ็คในหมวดนี้')}</div>}
          </div>

          {hasMore &&
          <div className="flex justify-center mt-8">
              <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-400 text-sm font-medium rounded-full shadow-sm transition-all">

                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {expanded ? t('แสดงน้อยลง') : t('ดูเพิ่ม')}
                <span className="text-xs text-brand-400">
                  {expanded ? `(${filtered.length})` : `(${visible.length} / ${filtered.length})`}
                </span>
              </button>
            </div>
          }
        </section>
      </div>
      <Footer t={t} />
    </div>);

}

export { HomeView, TYPE_FILTERS }
