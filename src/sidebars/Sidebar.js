import React from 'react';
import '../styles/sidebar.css';

function Sidebar({ onSelectCategory, selectedCategory }) {
  return (
    <div className="sidebar">
      <h3>Categorías</h3>
      <ul>
        <li className={selectedCategory === 'dormitorio' ? 'active' : ''} onClick={() => onSelectCategory('dormitorio')}>Dormitorio</li>
        <li className={selectedCategory === 'comedor' ? 'active' : ''} onClick={() => onSelectCategory('comedor')}>Comedor</li>
        <li className={selectedCategory === 'cocina' ? 'active' : ''} onClick={() => onSelectCategory('cocina')}>Cocina</li>
        <li className={selectedCategory === 'living' ? 'active' : ''} onClick={() => onSelectCategory('living')}>Living</li>
        <li className={selectedCategory === 'oficina' ? 'active' : ''} onClick={() => onSelectCategory('oficina')}>Oficina</li>
      </ul>
    </div>
  );
}

export default Sidebar;