import React from 'react'
import { Eye, Lock, Users } from '../../utils/Icons'
import { authApi } from '../../api/authApi'

const REMEMBER_KEY = 'rvp.login.employeeId';

function LoginView({ t, onSignIn }) {
  const [employeeId, setEmployeeId] = React.useState(() => localStorage.getItem(REMEMBER_KEY) || '');
  const [password, setPassword]     = React.useState('');
  const [showPw, setShowPw]         = React.useState(false);
  const [remember, setRemember]     = React.useState(() => !!localStorage.getItem(REMEMBER_KEY));
  const [errors, setErrors]         = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const next = {};
    if (!employeeId.trim()) next.employeeId = 'กรุณากรอกรหัสพนักงาน';
    if (!password)          next.password   = 'กรุณากรอกรหัสผ่าน';
    else if (password.length < 6) next.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const user = await authApi.login(employeeId.trim(), password);
      if (remember) localStorage.setItem(REMEMBER_KEY, employeeId.trim());
      else localStorage.removeItem(REMEMBER_KEY);
      onSignIn(user);
    } catch (err) {
      setErrors({ employeeId: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, var(--brand-25) 0%, var(--brand-50) 50%, var(--brand-100) 100%)' }}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--accent-600) 100%)' }}>
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <p className="text-xs font-bold text-brand-900">บริษัทกลางฯ</p>
            <p className="text-[10px] text-stone-500">บริษัท กลางคุ้มครองผู้ประสบภัยจากรถ จำกัด</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--accent-600) 100%)' }}>
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-3xl font-bold text-brand-900">RVP Library</span>
            </div>
            <h1 className="text-2xl font-bold text-brand-900 mb-1">เข้าสู่ระบบ</h1>
            <p className="text-sm text-stone-500">RVP Project Library</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-brand-100 p-7 space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-900 mb-1.5">รหัสพนักงาน <span className="text-red-500">*</span></label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={employeeId}
                  onChange={(e) => { setEmployeeId(e.target.value); if (errors.employeeId) setErrors({ ...errors, employeeId: '' }); }}
                  placeholder="0001"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all ${errors.employeeId ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-brand-400'}`}
                />
              </div>
              {errors.employeeId && <p className="text-[11px] text-red-600 mt-1">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-900 mb-1.5">รหัสผ่าน <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2.5 text-sm bg-stone-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all ${errors.password ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-brand-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500"
                >
                  <Eye size={14} />
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-brand-600 focus:ring-brand-400 focus:ring-2 cursor-pointer accent-brand-600"
              />
              <span className="text-xs text-stone-600">จดจำรหัสพนักงาน</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-lg shadow-sm transition-all ${submitting ? 'bg-stone-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:shadow-md active:scale-[0.99]'}`}
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>กำลังเข้าสู่ระบบ...</>
              ) : (
                <><Lock size={14} />เข้าสู่ระบบ</>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center pt-1">สำหรับพนักงานบริษัทกลางฯ เท่านั้น</p>
          </form>

          <p className="text-center text-[11px] text-stone-400 mt-6">
            ลืมรหัสผ่าน? ติดต่อฝ่าย IT ที่ <span className="font-medium text-brand-600">it-support@rvp.co.th</span>
          </p>
        </div>
      </div>

      <footer className="py-3 text-center text-white text-xs" style={{ background: 'linear-gradient(90deg, var(--brand-400) 0%, var(--brand-600) 100%)' }}>
        สงวนลิขสิทธิ์ © บริษัท กลางคุ้มครองผู้ประสบภัยจากรถ จำกัด
      </footer>
    </div>
  );
}

export { LoginView }
