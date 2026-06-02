import React from 'react'
import { ChevronDown, X, Check, Users, Package } from '../../utils/Icons'

function FilterDropdown({ audiences, architectures, audienceValue, archValue, onAudienceChange, onArchChange, t }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isFiltered  = audienceValue !== 'all' || archValue !== 'all';
  const parts = [
    audienceValue !== 'all' ? audienceValue : null,
    archValue !== 'all'     ? archValue     : null,
  ].filter(Boolean);
  const activeLabel = parts.length > 0 ? parts.join(' · ') : 'ตัวกรอง';

  const clearAll = () => { onAudienceChange('all'); onArchChange('all'); setOpen(false); };

  const toggleAudience = (opt) => {
    onAudienceChange(audienceValue === opt ? 'all' : opt);
  };
  const toggleArch = (opt) => {
    onArchChange(archValue === opt ? 'all' : opt);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className={`h-full inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full shadow-sm transition-all whitespace-nowrap border ${isFiltered ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-brand-700 border-brand-200 hover:border-brand-400'}`}
      >
        <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        <span className="max-w-[180px] truncate">{activeLabel}</span>
        {isFiltered && (
          <span
            role="button" tabIndex={0}
            onClick={(e) => { e.stopPropagation(); clearAll(); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); clearAll(); } }}
            className="w-4 h-4 rounded-full bg-white/25 hover:bg-white/50 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <X size={10} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 animate-fadeIn z-40 max-h-[440px] overflow-y-auto">

          <button
            onClick={clearAll}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${!isFiltered ? 'bg-brand-50 text-brand-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'}`}
          >
            <span>ทั้งหมด</span>
            {!isFiltered && <Check size={14} className="text-brand-600" />}
          </button>

          <div className="border-t border-stone-100 mt-1" />
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Users size={10} />ผู้ใช้งาน
            </p>
            {audienceValue !== 'all' && (
              <button onClick={() => onAudienceChange('all')} className="text-[10px] text-brand-500 hover:text-brand-700 hover:underline">
                ล้าง
              </button>
            )}
          </div>
          {audiences.map(opt => (
            <button
              key={opt}
              onClick={() => toggleAudience(opt)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${audienceValue === opt ? 'bg-brand-50 text-brand-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'}`}
            >
              <span className="truncate text-left">{opt}</span>
              {audienceValue === opt && <Check size={14} className="text-brand-600 flex-shrink-0 ml-2" />}
            </button>
          ))}

          <div className="border-t border-stone-100 mt-1" />
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Package size={10} />สถาปัตยกรรม
            </p>
            {archValue !== 'all' && (
              <button onClick={() => onArchChange('all')} className="text-[10px] text-brand-500 hover:text-brand-700 hover:underline">
                ล้าง
              </button>
            )}
          </div>
          {architectures.map(opt => (
            <button
              key={opt}
              onClick={() => toggleArch(opt)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${archValue === opt ? 'bg-brand-50 text-brand-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'}`}
            >
              <span className="truncate text-left">{opt}</span>
              {archValue === opt && <Check size={14} className="text-brand-600 flex-shrink-0 ml-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { FilterDropdown }
