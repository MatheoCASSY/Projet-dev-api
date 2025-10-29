import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export default function BackButton({ forceShow = false, onBack }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on the root/home page unless forced
  if (!forceShow && (!location || location.pathname === '/' || location.pathname === '')) return null;

  const handle = () => {
    if (typeof onBack === 'function') return onBack();
    return navigate(-1);
  };

  return (
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm me-2"
      onClick={handle}
      aria-label="Retour"
    >
      ← Retour
    </button>
  );
}
