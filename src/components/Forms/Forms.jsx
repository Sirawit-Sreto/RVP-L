import React from 'react'
import { Activity, Bug, Check, Package, Plus, Save, Search, Trash2, Users, X } from '../../utils/Icons'
import { EMOJI_OPTIONS, STATUS_OPTIONS, classifyDep } from '../../data/seed-data'

// Form components — modals for project / function / team / doc / api / tech / activity / person.

const ModalHeader = ({ title, onClose }) =>
<div className="flex items-center justify-between p-5 border-b border-stone-200">
    <h3 className="text-lg font-bold text-brand-900">{title}</h3>
    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center">
      <X size={16} className="text-stone-600" />
    </button>
  </div>;


const FormFooter = ({ onSubmit, onClose, label, cancelLabel, disabled }) =>
<div className="flex gap-2 justify-end p-5 border-t border-stone-200 bg-stone-50 rounded-b-2xl">
    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors">{cancelLabel}</button>
    <button onClick={onSubmit} disabled={disabled} className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${disabled ? 'bg-stone-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}>
      <Save size={14} />{label}
    </button>
  </div>;


const Input = ({ label, value, onChange, required, type = 'text', placeholder, error }) =>
<div>
    <label className="block text-xs font-medium text-brand-900 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-3 py-2 text-sm bg-stone-50 border rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none transition-all ${error ? 'border-red-300 focus:border-red-400' : 'border-stone-200 focus:border-brand-400'}`} />
    {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
  </div>;


const Textarea = ({ label, value, onChange, rows = 3 }) =>
<div>
    <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none" />
  </div>;


const FormSelect = ({ label, value, onChange, options }) =>
<div>
    <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
    <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-brand-400 outline-none">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>;


const ExtensibleSelect = ({ label, value, onChange, options, onAddOption, addLabel, addTitle, t }) => {
  const ADD_SENTINEL = '__add_new__';
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const commit = () => {
    const v = draft.trim();
    if (!v) {setAdding(false);return;}
    if (!options.includes(v)) onAddOption(v);
    onChange(v);
    setDraft('');setAdding(false);
  };
  const handleSelect = (v) => {
    if (v === ADD_SENTINEL) {setAdding(true);return;}
    onChange(v);
  };
  return (
    <div>
      <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
      {adding ?
      <div className="p-2 bg-brand-50 border border-brand-200 rounded-lg">
          <p className="text-[11px] font-medium text-brand-700 mb-1.5">{addTitle}</p>
          <div className="flex gap-1.5">
            <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {if (e.key === 'Enter') commit();if (e.key === 'Escape') {setAdding(false);setDraft('');}}}
            placeholder={addTitle}
            className="flex-1 px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-md focus:border-brand-400 outline-none" />

            <button onClick={commit} className="px-2 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-md inline-flex items-center gap-1">
              <Check size={12} />{t('บันทึก')}
            </button>
            <button onClick={() => {setAdding(false);setDraft('');}} className="px-2 py-1.5 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium rounded-md">
              <X size={12} />
            </button>
          </div>
        </div> :

      <select
        value={value || ''}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-brand-400 outline-none">

          {options.map((o) => <option key={o} value={o}>{o}</option>)}
          <option value="" disabled>──────────</option>
          <option value={ADD_SENTINEL}>{addLabel}</option>
        </select>
      }
    </div>);

};

const ChipsMulti = ({ label, value, onChange, options }) => {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));else
    onChange([...value, opt]);
  };
  return (
    <div>
      <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${active ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:border-brand-300'}`}>
              {active && <span className="mr-1">✓</span>}{opt}
            </button>);

        })}
      </div>
    </div>);

};

const EmojiPicker = ({ label, value, onChange }) =>
<div>
    <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
    <div className="grid grid-cols-4 gap-2">
      {EMOJI_OPTIONS.map((emo) => {
      const active = value === emo;
      return (
        <button
          key={emo}
          type="button"
          onClick={() => onChange(active ? '' : emo)}
          className={`aspect-square rounded-lg border text-2xl flex items-center justify-center transition-all ${active ? 'ring-2 ring-brand-500 bg-brand-50 border-brand-300 shadow-sm' : 'border-stone-200 bg-white hover:border-brand-300 hover:bg-brand-25'}`}>

            {emo}
          </button>);

    })}
    </div>
  </div>;


const ImageUpload = ({ label, value, onChange, t }) => {
  const ref = React.useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <div>
      <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-25 flex items-center justify-center overflow-hidden flex-shrink-0">
          {value ?
          <img src={value} alt="project" className="w-full h-full object-cover" /> :

          <Package size={24} className="text-brand-300" />
          }
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <button type="button" onClick={() => ref.current?.click()} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg shadow-sm w-fit">
            <Package size={12} />{value ? t('เปลี่ยนรูป') : t('อัพโหลดรูป')}
          </button>
          {value &&
          <button type="button" onClick={() => onChange('')} className="text-[11px] text-red-600 hover:text-red-700 hover:underline w-fit">
              {t('ลบรูป')}
            </button>
          }
          <p className="text-[10px] text-stone-400">{t('แสดงแทน RVP text avatar บนตัวการ์ดโปรเจ็ค')}</p>
        </div>
        <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>);

};

const StatusChips = ({ label, value, onChange }) =>
<div>
    <label className="block text-xs font-medium text-brand-900 mb-1.5">{label}</label>
    <div className="flex flex-wrap gap-1.5">
      {STATUS_OPTIONS.map((opt) => {
      const active = value === opt.id;
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${active ? opt.tone + ' shadow-sm scale-[1.02]' : 'bg-white text-stone-500 border-stone-200 hover:border-brand-300'}`}>

            <span className={`w-1.5 h-1.5 rounded-full ${active ? opt.dot : 'bg-stone-300'}`}></span>
            {opt.th}
          </button>);

    })}
    </div>
  </div>;


function ProjectForm({ initialData, mode, onSubmit, onClose, t, categories, onAddCategory, audiences, onAddAudience, projectTypes, onAddProjectType }) {
  const [data, setData] = React.useState({
    name: '', subtitle: '', fullName: '', desc: '',
    type: projectTypes && projectTypes[0] || 'พัฒนาเอง',
    audience: audiences && audiences[0] || 'พนักงาน',
    category: categories && categories[0] || 'Web App',
    status: 'develop',
    dns: '',
    image: '',
    vendor: '',
    ...initialData
  });
  const [errors, setErrors] = React.useState({});
  const submit = () => {
    const e = {};
    if (!data.name?.trim()) e.name = t('ต้องไม่ว่าง') || 'required';
    if (!data.fullName?.trim()) e.fullName = t('ต้องไม่ว่าง') || 'required';
    setErrors(e);
    if (Object.keys(e).length === 0) onSubmit(data);
  };
  return (
    <>
      <ModalHeader title={mode === 'add' ? t('+ เพิ่มโปรเจ็คใหม่') : t('แก้ไขโปรเจ็ค')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <ImageUpload label={t('รูปโปรเจ็ค')} value={data.image} onChange={(v) => setData({ ...data, image: v })} t={t} />

        <div className="grid grid-cols-2 gap-3">
          <Input label={t('ชื่อย่อ')} value={data.name} onChange={(v) => setData({ ...data, name: v })} required placeholder="UMS" error={errors.name} />
          <Input label={t('ชื่อเต็ม')} value={data.fullName} onChange={(v) => setData({ ...data, fullName: v })} required placeholder="User Management System" error={errors.fullName} />
        </div>
        <Textarea label={t('คำอธิบาย')} value={data.desc} onChange={(v) => setData({ ...data, desc: v })} />

        <StatusChips label={t('สถานะโปรเจ็ค')} value={data.status} onChange={(v) => setData({ ...data, status: v })} />

        <div className="grid grid-cols-2 gap-3">
          <ExtensibleSelect
            label={t('ประเภท')}
            value={data.type}
            onChange={(v) => setData({ ...data, type: v })}
            options={projectTypes}
            onAddOption={onAddProjectType}
            addLabel={t('+ เพิ่มประเภทใหม่')}
            addTitle={t('ชื่อประเภทใหม่')}
            t={t} />

          <Input label="DNS" value={data.dns} onChange={(v) => setData({ ...data, dns: v })} placeholder="ums.rvp.co.th" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ExtensibleSelect
            label={t('ผู้ใช้งาน')}
            value={data.audience}
            onChange={(v) => setData({ ...data, audience: v })}
            options={audiences}
            onAddOption={onAddAudience}
            addLabel={t('+ เพิ่มผู้ใช้งานใหม่')}
            addTitle={t('ชื่อผู้ใช้งานใหม่')}
            t={t} />

          <ExtensibleSelect
            label={t('หมวดหมู่ (สถาปัตยกรรม)')}
            value={data.category}
            onChange={(v) => setData({ ...data, category: v })}
            options={categories}
            onAddOption={onAddCategory}
            addLabel={t('+ เพิ่มหมวดหมู่ใหม่')}
            addTitle={t('ชื่อหมวดหมู่ใหม่')}
            t={t} />

        </div>

        {data.type === 'จ้างพัฒนา' && <Input label={t('ชื่อ Vendor')} value={data.vendor} onChange={(v) => setData({ ...data, vendor: v })} placeholder={t('ชื่อบริษัทที่จ้างทำ')} />}
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

function FunctionForm({ initialData, mode, onSubmit, onClose, t }) {
  const [value, setValue] = React.useState(initialData?.value || '');
  const [err, setErr] = React.useState('');
  const submit = () => {if (!value.trim()) {setErr(t('ต้องไม่ว่าง') || 'required');return;}onSubmit({ value: value.trim() });};
  return (
    <>
      <ModalHeader title={mode === 'add' ? t('+ เพิ่มประวัติการแก้ไข') : t('แก้ไขประวัติการแก้ไข')} onClose={onClose} />
      <div className="p-5">
        <Input label={t('รายละเอียดการแก้ไข')} value={value} onChange={(v) => {setValue(v);setErr('');}} required placeholder="..." error={err} />
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

function TeamForm({ roleLabel, peopleData, existingMembers, onSubmit, onClose, t }) {
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(new Set());
  const [useCustom, setUseCustom] = React.useState(false);
  const [ext, setExt] = React.useState({ name: '', company: '', position: '', email: '', phone: '' });
  const [err, setErr] = React.useState('');
  const excluded = React.useMemo(() => new Set(existingMembers || []), [existingMembers]);

  const groups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const buckets = {};
    Object.entries(peopleData).forEach(([key, person]) => {
      if (excluded.has(key)) return;
      const fields = [key, person.name, person.position, person.dept, person.company].filter(Boolean);
      if (q && !fields.some((s) => String(s).toLowerCase().includes(q))) return;
      const groupName = person.external ? 'บุคคลภายนอก' : (person.dept || 'อื่น ๆ');
      (buckets[groupName] = buckets[groupName] || []).push({ key, person });
    });
    return Object.entries(buckets).sort((a, b) => {
      const aExt = a[0] === 'บุคคลภายนอก';
      const bExt = b[0] === 'บุคคลภายนอก';
      if (aExt && !bExt) return 1;
      if (!aExt && bExt) return -1;
      return a[0].localeCompare(b[0]);
    });
  }, [peopleData, query, excluded]);

  const totalMatches = groups.reduce((sum, [, list]) => sum + list.length, 0);
  const allKeys = React.useMemo(() => groups.flatMap(([, list]) => list.map((it) => it.key)), [groups]);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));

  const toggle = (k) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(k)) next.delete(k);else next.add(k);
    return next;
  });
  const toggleAll = () => setSelected((prev) => {
    if (allSelected) {
      const next = new Set(prev);
      allKeys.forEach((k) => next.delete(k));
      return next;
    }
    return new Set([...prev, ...allKeys]);
  });

  const submit = () => {
    if (useCustom) {
      const name = ext.name.trim();
      if (!name) {setErr(t('กรุณากรอกชื่อ'));return;}
      onSubmit({
        names: [name],
        newPerson: {
          key: name,
          name,
          position: ext.position.trim() || 'บุคคลภายนอก',
          dept: ext.company.trim() || 'บุคคลภายนอก',
          company: ext.company.trim(),
          email: ext.email.trim(),
          phone: ext.phone.trim(),
          external: true,
          avatar: '🧑‍💼',
        }
      });
      return;
    }
    if (selected.size === 0) {setErr(t('กรุณาเลือกอย่างน้อย 1 คน'));return;}
    onSubmit({ names: [...selected] });
  };

  return (
    <>
      <ModalHeader title={`+ ${t('เพิ่ม')} ${roleLabel}`} onClose={onClose} />
      <div className="p-5 space-y-3">
        {!useCustom ?
        <>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('ค้นหาชื่อ / ตำแหน่ง / แผนก...')}
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none" />

              {query &&
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-stone-100 flex items-center justify-center" title={t('ล้าง')}>
                  <X size={12} className="text-stone-500" />
                </button>
            }
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>{t('พบ {n} คน', { n: totalMatches })}</span>
              <div className="flex items-center gap-3">
                {totalMatches > 0 &&
              <button onClick={toggleAll} className="text-brand-600 hover:underline font-medium">
                    {allSelected ? t('ล้างที่เลือก') : t('เลือกทั้งหมดในผลค้นหา')}
                  </button>
              }
                <span className="font-semibold text-brand-700">{t('เลือก {n} คน', { n: selected.size })}</span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-lg max-h-[42vh] overflow-y-auto bg-white">
              {totalMatches === 0 ?
            <div className="text-center py-10 text-stone-400">
                  <Users size={28} className="mx-auto mb-2 text-stone-300" />
                  <p className="text-sm">{query ? t('ไม่พบพนักงานที่ค้นหา') : t('ไม่มีพนักงานในระบบ')}</p>
                </div> :

            groups.map(([groupName, items]) => {
              const isExternal = groupName === 'บุคคลภายนอก';
              return (
                <div key={groupName}>
                      <div className={`sticky top-0 z-10 px-3 py-1.5 border-b border-stone-200 ${isExternal ? 'bg-amber-50' : 'bg-stone-50'}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isExternal ? 'text-amber-700' : 'text-stone-500'}`}>
                          {isExternal && '🤝 '}{groupName} <span className="font-normal opacity-60">({items.length})</span>
                        </p>
                      </div>
                      <ul>
                        {items.map(({ key, person }) => {
                      const isSelected = selected.has(key);
                      const display = person.name;
                      const sub = person.position;
                      const companyChip = person.external && person.company;
                      return (
                        <li key={key}>
                              <button
                            type="button"
                            onClick={() => {toggle(key);setErr('');}}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-brand-50 hover:bg-brand-100' : 'hover:bg-stone-50'} border-b border-stone-100 last:border-b-0`}>

                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                                  {person.avatar || '👤'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <p className="text-sm font-medium text-stone-900 truncate">{display}</p>
                                    {person.external && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-700 border border-amber-200 flex-shrink-0">{t('ภายนอก')}</span>}
                                  </div>
                                  <p className="text-[11px] text-stone-500 truncate">
                                    {sub}{companyChip ? <span className="text-amber-700"> · {person.company}</span> : ''}
                                  </p>
                                </div>
                                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-stone-300 bg-white'}`}>
                                  {isSelected && <Check size={12} />}
                                </span>
                              </button>
                            </li>);

                    })}
                      </ul>
                    </div>);

            })
            }
            </div>
            {err && <p className="text-[11px] text-red-600">{err}</p>}

            <button onClick={() => {setUseCustom(true);setErr('');}} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-700 text-sm font-medium rounded-xl transition-all">
              <Plus size={14} />{t('+ เพิ่มบุคคลภายนอก (Vendor / Contractor)')}
            </button>
          </> :

        <>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5">
              <span className="text-base">🤝</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-900">{t('เพิ่มบุคคลภายนอก')}</p>
                <p className="text-[10px] text-amber-700 leading-relaxed">{t('สำหรับ Vendor / Contractor / ที่ปรึกษา ที่ไม่ได้อยู่ในรายชื่อพนักงาน — ระบบจะบันทึกลงทะเบียนเพื่อใช้ในโปรเจ็คอื่นได้')}</p>
              </div>
            </div>
            <Input label={t('ชื่อ')} value={ext.name} onChange={(v) => {setExt({ ...ext, name: v });setErr('');}} required placeholder="คุณ ABC / Mr. John Smith" error={err} />
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('บริษัท / หน่วยงาน')} value={ext.company} onChange={(v) => setExt({ ...ext, company: v })} placeholder="ABC Software Co., Ltd." />
              <Input label={t('ตำแหน่ง')} value={ext.position} onChange={(v) => setExt({ ...ext, position: v })} placeholder="Senior Consultant" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('Email')} value={ext.email} onChange={(v) => setExt({ ...ext, email: v })} placeholder="name@vendor.com" />
              <Input label={t('เบอร์โทร')} value={ext.phone} onChange={(v) => setExt({ ...ext, phone: v })} placeholder="081-234-5678" />
            </div>
            <button onClick={() => setUseCustom(false)} className="text-xs text-brand-600 hover:underline">{t('← เลือกจากรายชื่อแทน')}</button>
          </>
        }
      </div>
      <FormFooter
        onSubmit={submit}
        onClose={onClose}
        label={useCustom ? t('เพิ่มบุคคลภายนอก') : selected.size > 1 ? t('เพิ่ม {n} คน', { n: selected.size }) : t('บันทึก')}
        cancelLabel={t('ยกเลิก')} />

    </>);

}

function DocForm({ initialData, mode, onSubmit, onClose, t }) {
  const [data, setData] = React.useState({ name: '', url: '#', type: 'miro', ...initialData });
  const [err, setErr] = React.useState('');
  const submit = () => {if (!data.name?.trim()) {setErr(t('ต้องไม่ว่าง') || 'required');return;}onSubmit(data);};
  return (
    <>
      <ModalHeader title={mode === 'add' ? t('+ เพิ่มเอกสาร') : t('แก้ไขเอกสาร')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <Input label={t('ชื่อเอกสาร')} value={data.name} onChange={(v) => {setData({ ...data, name: v });setErr('');}} required placeholder="Requirement Doc" error={err} />
        <FormSelect label={t('ประเภท')} value={data.type} onChange={(v) => setData({ ...data, type: v })} options={[{ value: 'miro', label: '🗂️ Miro' }, { value: 'excel', label: '📊 Excel' }, { value: 'pdf', label: '📄 PDF' }, { value: 'doc', label: '📄 Document' }, { value: 'figma', label: '🎨 Figma' }]} />
        <Input label={t('URL / ลิงก์')} value={data.url} onChange={(v) => setData({ ...data, url: v })} placeholder="https://..." />
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

function ApiForm({ initialData, mode, onSubmit, onClose, t, apiTypes, onAddApiType }) {
  const [data, setData] = React.useState({ name: '', type: apiTypes && apiTypes[0] || 'Internal', desc: '', ...initialData });
  const [err, setErr] = React.useState('');
  const submit = () => {if (!data.name?.trim()) {setErr(t('ต้องไม่ว่าง') || 'required');return;}onSubmit(data);};
  return (
    <>
      <ModalHeader title={mode === 'add' ? t('+ เพิ่ม API') : t('แก้ไข API')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <Input label={t('ชื่อ API / Service')} value={data.name} onChange={(v) => {setData({ ...data, name: v });setErr('');}} required placeholder="Payment Gateway" error={err} />
        <ExtensibleSelect
          label={t('ประเภท')}
          value={data.type}
          onChange={(v) => setData({ ...data, type: v })}
          options={apiTypes}
          onAddOption={onAddApiType}
          addLabel={t('+ เพิ่มประเภทใหม่')}
          addTitle={t('ชื่อประเภทใหม่')}
          t={t} />

        <Textarea label={t('คำอธิบาย API')} value={data.desc} onChange={(v) => setData({ ...data, desc: v })} rows={2} />
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

const TECH_BUILTIN_CATS = [
{ key: 'frontend', label: 'Front-end', icon: '🎨' },
{ key: 'backend', label: 'Back-end', icon: '⚙️' },
{ key: 'database', label: 'Databases', icon: '🗄️' },
{ key: 'devops', label: 'DevOps', icon: '🔧' },
{ key: 'infrastructure', label: 'Infrastructure', icon: '☁️' },
{ key: 'integrations', label: 'Integrations', icon: '🔌' }];


function TechForm({ initialData, onSubmit, onClose, t }) {
  const initCats = React.useMemo(() => {
    const builtinKeys = new Set(TECH_BUILTIN_CATS.map((b) => b.key));
    const list = TECH_BUILTIN_CATS.map((b) => ({
      key: b.key, label: b.label, icon: b.icon, isBuiltin: true,
      items: [...(initialData?.[b.key] || [])]
    }));
    Object.entries(initialData || {}).forEach(([k, v]) => {
      if (!builtinKeys.has(k) && Array.isArray(v)) {
        list.push({ key: k, label: k, icon: '⚙️', isBuiltin: false, items: [...v] });
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cats, setCats] = React.useState(initCats);
  const [showAddCat, setShowAddCat] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState('');
  const [importPreview, setImportPreview] = React.useState(null);
  const [importError, setImportError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const addItem = (catIdx) => setCats((prev) => prev.map((c, i) => i === catIdx ? { ...c, items: [...c.items, ''] } : c));
  const updateItem = (catIdx, itemIdx, val) => setCats((prev) => prev.map((c, i) => i === catIdx ? { ...c, items: c.items.map((it, j) => j === itemIdx ? val : it) } : c));
  const removeItem = (catIdx, itemIdx) => setCats((prev) => prev.map((c, i) => i === catIdx ? { ...c, items: c.items.filter((_, j) => j !== itemIdx) } : c));

  const addCategory = () => {
    const v = newCatName.trim();
    if (!v) return;
    const slug = v.toLowerCase().replace(/[^a-z0-9ก-๙]+/gi, '_').replace(/^_|_$/g, '');
    const key = slug || `cat_${Date.now()}`;
    if (cats.some((c) => c.key === key)) return;
    setCats((prev) => [...prev, { key, label: v, icon: '⚙️', isBuiltin: false, items: [] }]);
    setNewCatName('');
    setShowAddCat(false);
  };
  const removeCategory = (catIdx) => setCats((prev) => prev.filter((_, i) => i !== catIdx));

  const handleFile = async (e) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const deps = { ...(json.dependencies || {}), ...(json.devDependencies || {}) };
      const devOnly = new Set(Object.keys(json.devDependencies || {}));
      const names = Object.keys(deps);
      if (names.length === 0) {setImportError(t('ไม่พบ dependencies'));e.target.value = '';return;}
      const byCat = { frontend: [], backend: [], database: [], devops: [], infrastructure: [], integrations: [] };
      const unmatched = [];
      names.forEach((dep) => {
        let cat = classifyDep(dep);
        if (!cat && devOnly.has(dep)) cat = 'devops';
        if (cat) byCat[cat].push(dep);else
        unmatched.push(dep);
      });
      setImportPreview({ byCat, unmatched });
    } catch (err) {
      setImportError(t('อ่านไฟล์ไม่ได้ — ตรวจสอบว่าเป็น JSON ที่ถูกต้อง'));
    } finally {
      e.target.value = '';
    }
  };
  const applyImport = (mode) => {
    if (!importPreview) return;
    setCats((prev) => prev.map((c) => {
      const imported = importPreview.byCat[c.key] || [];
      if (imported.length === 0 && mode === 'merge') return c;
      const existing = mode === 'merge' ? c.items : [];
      const merged = Array.from(new Set([...existing, ...imported].filter(Boolean)));
      return { ...c, items: merged };
    }));
    setImportPreview(null);
  };

  const handleSubmit = () => {
    const result = {};
    cats.forEach((c) => {
      result[c.key] = c.items.map((s) => (s || '').trim()).filter(Boolean);
    });
    onSubmit(result);
  };

  return (
    <>
      <ModalHeader title={t('แก้ไข Tech Stack')} onClose={onClose} />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-brand-50 to-brand-25 border border-brand-200 rounded-xl">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Package size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-900">{t('นำเข้าจาก package.json')}</p>
              <p className="text-[10px] text-stone-500 leading-relaxed">{t('Auto-classify dependencies + devDependencies')}</p>
            </div>
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 shadow-sm">
            <Package size={12} />{t('📦 Import จาก package.json')}
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
        </div>
        {importError && <p className="text-[11px] text-red-600 px-1">{importError}</p>}

        {cats.map((cat, catIdx) =>
        <div key={cat.key} className="border border-stone-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-b border-stone-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">{cat.icon}</span>
                <p className="text-sm font-semibold text-brand-900 truncate">{cat.isBuiltin ? t(cat.label) : cat.label}</p>
                <span className="text-[10px] text-stone-400 flex-shrink-0">({cat.items.length})</span>
              </div>
              {!cat.isBuiltin &&
            <button onClick={() => removeCategory(catIdx)} className="w-6 h-6 rounded bg-white hover:bg-red-50 flex items-center justify-center flex-shrink-0" title={t('ลบหมวด')}>
                  <Trash2 size={11} className="text-red-600" />
                </button>
            }
            </div>
            <div className="p-2.5 space-y-1.5">
              {cat.items.map((item, i) =>
            <div key={i} className="flex items-center gap-1.5">
                  <input
                type="text"
                value={item}
                onChange={(e) => updateItem(catIdx, i, e.target.value)}
                placeholder="React, Vue.js, …"
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg focus:border-brand-400 focus:ring-1 focus:ring-brand-100 outline-none" />

                  <button onClick={() => removeItem(catIdx, i)} className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:bg-red-50 hover:border-red-200 flex items-center justify-center flex-shrink-0" title={t('ลบ')}>
                    <X size={12} className="text-stone-500" />
                  </button>
                </div>
            )}
              <button onClick={() => addItem(catIdx)} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 text-brand-600 hover:bg-brand-50 rounded-md font-medium">
                <Plus size={11} />{t('เพิ่ม item')}
              </button>
            </div>
          </div>
        )}

        {showAddCat ?
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl">
            <p className="text-[11px] font-medium text-brand-700 mb-1.5">{t('ชื่อหมวดใหม่')}</p>
            <div className="flex gap-1.5">
              <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => {if (e.key === 'Enter') addCategory();if (e.key === 'Escape') {setShowAddCat(false);setNewCatName('');}}}
              placeholder="Mobile / IoT / Analytics …"
              className="flex-1 px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-md focus:border-brand-400 outline-none" />

              <button onClick={addCategory} className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-md inline-flex items-center gap-1">
                <Check size={12} />{t('บันทึก')}
              </button>
              <button onClick={() => {setShowAddCat(false);setNewCatName('');}} className="px-2 py-1.5 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium rounded-md">
                <X size={12} />
              </button>
            </div>
          </div> :

        <button onClick={() => setShowAddCat(true)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-dashed border-stone-300 hover:border-brand-400 hover:bg-brand-50 text-stone-600 hover:text-brand-700 text-sm font-medium rounded-xl transition-all">
            <Plus size={14} />{t('เพิ่มหมวด Tech Stack')}
          </button>
        }
      </div>
      <FormFooter onSubmit={handleSubmit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />

      {importPreview &&
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col z-10 animate-fadeIn">
          <ModalHeader title={t('ยืนยันการนำเข้า')} onClose={() => setImportPreview(null)} />
          <div className="p-5 space-y-3 overflow-y-auto flex-1">
            {Object.entries(importPreview.byCat).map(([cat, items]) => items.length > 0 &&
          <div key={cat} className="p-3 bg-brand-50 border border-brand-100 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-1.5">{t(cat === 'frontend' ? 'Front-end' : cat === 'backend' ? 'Back-end' : cat === 'database' ? 'Databases' : cat === 'devops' ? 'DevOps' : cat === 'infrastructure' ? 'Infrastructure' : 'Integrations')}</p>
                <div className="flex flex-wrap gap-1">
                  {items.map((it) => <span key={it} className="px-2 py-0.5 bg-white text-[11px] text-stone-700 rounded-md border border-stone-200">{it}</span>)}
                </div>
              </div>
          )}
            {importPreview.unmatched.length > 0 &&
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">{t('ไม่จัดประเภท (ข้าม)')}</p>
                <div className="flex flex-wrap gap-1">
                  {importPreview.unmatched.map((it) => <span key={it} className="px-2 py-0.5 bg-white text-[11px] text-stone-500 rounded-md border border-amber-200">{it}</span>)}
                </div>
              </div>
          }
          </div>
          <div className="flex gap-2 justify-end p-5 border-t border-stone-200 bg-stone-50 rounded-b-2xl">
            <button onClick={() => setImportPreview(null)} className="px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg">{t('ยกเลิก')}</button>
            <button onClick={() => applyImport('merge')} className="px-3 py-2 text-xs font-medium text-brand-700 bg-white border border-brand-300 hover:bg-brand-50 rounded-lg">{t('รวมเข้า Tech Stack ปัจจุบัน')}</button>
            <button onClick={() => applyImport('replace')} className="px-3 py-2 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg">{t('แทนที่ Tech Stack เดิม')}</button>
          </div>
        </div>
      }
    </>);

}

function ActivityForm({ initialData, mode, onSubmit, onClose, t }) {
  const [data, setData] = React.useState({ type: 'feature', title: '', desc: '', date: '', time: '', version: '', env: '', ref: '', ...initialData });
  const [err, setErr] = React.useState('');
  const submit = () => {if (!data.title?.trim()) {setErr(t('ต้องไม่ว่าง') || 'required');return;}onSubmit(data);};
  return (
    <>
      <ModalHeader title={mode === 'add' ? t('+ เพิ่ม Activity') : t('แก้ไข Activity')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <FormSelect label={t('ประเภท')} value={data.type} onChange={(v) => setData({ ...data, type: v })} options={[
        { value: 'deploy', label: `🚀 ${t('Deploy')}` }, { value: 'feature', label: `✨ ${t('Feature')}` }, { value: 'bug', label: `🐛 ${t('Bug Fix')}` },
        { value: 'refactor', label: `🔧 ${t('Refactor')}` }, { value: 'doc', label: `📝 ${t('Document')}` }, { value: 'review', label: `👁️ ${t('Review')}` },
        { value: 'meeting', label: `🎯 ${t('Meeting')}` }, { value: 'incident', label: `⚠️ ${t('Incident')}` }]
        } />
        <Input label={t('หัวข้อ')} value={data.title} onChange={(v) => {setData({ ...data, title: v });setErr('');}} required placeholder="..." error={err} />
        <Textarea label={t('รายละเอียด')} value={data.desc} onChange={(v) => setData({ ...data, desc: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('วันที่')} value={data.date} onChange={(v) => setData({ ...data, date: v })} placeholder="15 May 2026" />
          <Input label={t('เวลา')} value={data.time} onChange={(v) => setData({ ...data, time: v })} placeholder="14:30" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label={t('Version')} value={data.version} onChange={(v) => setData({ ...data, version: v })} placeholder="v2.3.0" />
          <FormSelect label={t('Environment')} value={data.env} onChange={(v) => setData({ ...data, env: v })} options={[
          { value: '', label: '-' }, { value: 'Development', label: t('Development') }, { value: 'Staging', label: t('Staging') }, { value: 'UAT', label: t('UAT') }, { value: 'Production', label: t('Production') }]
          } />
          <Input label={t('Reference')} value={data.ref} onChange={(v) => setData({ ...data, ref: v })} placeholder="PR #245" />
        </div>
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

function PersonForm({ initialData, onSubmit, onClose, t }) {
  const [data, setData] = React.useState({
    name: '', position: '', dept: '',
    email: '', phone: '', slack: '', line: '', ...initialData
  });
  const [err, setErr] = React.useState({});
  const submit = () => {
    const e = {};
    if (!data.name?.trim()) e.name = t('ต้องไม่ว่าง') || 'required';
    if (!data.position?.trim()) e.position = t('ต้องไม่ว่าง') || 'required';
    setErr(e);
    if (Object.keys(e).length === 0) onSubmit(data);
  };
  return (
    <>
      <ModalHeader title={t('แก้ไขข้อมูล Person')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <Input label={t('ชื่อ')} value={data.name} onChange={(v) => setData({ ...data, name: v })} required error={err.name} />
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('ตำแหน่ง')} value={data.position} onChange={(v) => setData({ ...data, position: v })} required error={err.position} />
          <Input label={t('แผนก')} value={data.dept} onChange={(v) => setData({ ...data, dept: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('Email')} value={data.email} onChange={(v) => setData({ ...data, email: v })} placeholder="name@rvp.co.th" />
          <Input label={t('เบอร์โทร')} value={data.phone} onChange={(v) => setData({ ...data, phone: v })} placeholder="081-234-5678" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('Slack')} value={data.slack} onChange={(v) => setData({ ...data, slack: v })} placeholder="@handle" />
          <Input label={t('LINE')} value={data.line} onChange={(v) => setData({ ...data, line: v })} placeholder="@line-id" />
        </div>
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

function RoleForm({ initialData, onSubmit, onClose, t }) {
  const [data, setData] = React.useState({ label: '', icon: '👤', ...initialData });
  const [err, setErr] = React.useState('');
  const submit = () => {
    if (!data.label?.trim()) {setErr(t('ต้องไม่ว่าง') || 'required');return;}
    onSubmit({ label: data.label.trim(), icon: data.icon || '👤' });
  };
  return (
    <>
      <ModalHeader title={t('+ เพิ่มตำแหน่ง')} onClose={onClose} />
      <div className="p-5 space-y-4">
        <Input
          label={t('ชื่อตำแหน่ง')}
          value={data.label}
          onChange={(v) => {setData({ ...data, label: v });setErr('');}}
          required
          placeholder="QA / Designer / Tester"
          error={err} />

        <EmojiPicker label={t('ไอคอนตำแหน่ง')} value={data.icon} onChange={(v) => setData({ ...data, icon: v })} />
      </div>
      <FormFooter onSubmit={submit} onClose={onClose} label={t('บันทึก')} cancelLabel={t('ยกเลิก')} />
    </>);

}

export {
  ProjectForm, FunctionForm, TeamForm, DocForm, ApiForm, TechForm, ActivityForm, PersonForm, RoleForm,
  ModalHeader, FormFooter, Input, Textarea, FormSelect, ExtensibleSelect, ChipsMulti, EmojiPicker,
  ImageUpload, StatusChips
}
