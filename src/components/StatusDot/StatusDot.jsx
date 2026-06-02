import React from 'react'
import { STATUS_OPTIONS } from '../../data/seed-data'

const StatusDot = ({ status, className }) => {
  const opt = STATUS_OPTIONS.find((o) => o.id === status);
  if (!opt) return null;
  return (
    <span
      title={opt.th}
      className={`${className || ''} w-2.5 h-2.5 rounded-full ring-2 ring-white shadow ${opt.dot}`}>
    </span>);

};

export { StatusDot }
