import React from 'react'

const Footer = ({ t }) =>
<footer className="mt-12 py-4 text-center text-white text-sm" style={{ background: 'linear-gradient(90deg, var(--brand-400) 0%, var(--brand-600) 100%)' }}>
    {t('สงวนลิขสิทธิ์ © บริษัท กลางคุ้มครองผู้ประสบภัยจากรถ จำกัด')}
  </footer>;

export { Footer }
