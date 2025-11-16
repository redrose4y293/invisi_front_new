import React from 'react';

export default function LanguageSwitcher() {
  return (
    <select className="card" style={{ padding: 6 }} defaultValue="en">
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="fr">FR</option>
      <option value="ar">AR</option>
    </select>
  );
}
