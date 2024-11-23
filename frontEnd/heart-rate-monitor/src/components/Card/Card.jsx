import React from 'react';
import './Card.css';

function Card({ title, content, imageUrl, imageAlt }) {
  return (
    <div className="card">
      <div className="card-image-container">
        <img src={imageUrl} alt={imageAlt} className="card-image" />
      </div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{content}</p>
      </div>
    </div>
  );
}

export default Card;