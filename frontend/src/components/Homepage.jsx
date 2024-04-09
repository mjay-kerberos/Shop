import React from 'react';
import backgroundImage from '../../public/images/market.jpg';
import './Homepage.css';

const HomePage = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  return (
    <div className="homepage-background" style={backgroundStyle}>
      <div className="text-overlay">
        Republic Starlight Outpost
      </div>
      <div className="symbol-overlay">
        Republic Starlight Outpost
      </div>
    </div>
  );
};

export default HomePage;

