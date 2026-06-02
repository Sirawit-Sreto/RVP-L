import React from 'react'
import { LogOut } from '../../utils/Icons'

const Header = ({ t, user, onSignOut }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);};
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);
  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();
  return (
    <header className="bg-white border-b border-brand-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--accent-600) 100%)' }}>
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <p className="text-xs font-bold text-brand-900">{t('บริษัทกลางฯ')}</p>
            <p className="text-[10px] text-stone-500">{t('บริษัท กลางคุ้มครองผู้ประสบภัยจากรถ จำกัด')}</p>
          </div>
        </div>
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="text-brand-600">RVP</span>
          <span className="font-light" style={{ color: 'var(--accent-600)' }}>Library</span>
        </div>
        <div className="flex items-center gap-3">
          {user &&
          <div className="relative" ref={ref}>
              <button
              onClick={() => setMenuOpen((s) => !s)}
              title={user.email}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%)' }}>

                {initial}
              </button>
              {menuOpen &&
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 animate-fadeIn z-50">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">{t('เข้าสู่ระบบในชื่อ')}</p>
                    <p className="text-xs font-medium text-stone-800 truncate" title={user.email}>{user.name || user.email}</p>
                    {user.employeeId && <p className="text-[10px] text-stone-400">รหัส {user.employeeId}</p>}
                  </div>
                  <button
                onClick={() => {setMenuOpen(false);onSignOut?.();}}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-red-50 hover:text-red-700 transition-colors">

                    <LogOut size={14} />{t('ออกจากระบบ')}
                  </button>
                </div>
            }
            </div>
          }
        </div>
      </div>
    </header>);

};

export { Header }
