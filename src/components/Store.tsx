import React from 'react';
import './Store.css';

interface StoreProps {}

export const Store: React.FC<StoreProps> = () => {
  return (
    <div className="store">
      <div className="store-header">
        <h1 className="store-title">Store</h1>
      </div>

      <div className="store-content">
        <div className="store-body">
          <div className="coming-soon">
            <span className="material-symbols-outlined coming-soon-icon">storefront</span>
            <h2>Coming Soon</h2>
            <p>Exciting items will be available here!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

