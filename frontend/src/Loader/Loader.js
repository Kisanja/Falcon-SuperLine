import React from 'react';
import './Loader.css';
import loadingGif from '../assets/pravega-loading.gif'; // Or use a spinner icon

const Loader = () => {
  return (
    <div className="loader-overlay">
      <img src={loadingGif} alt="Loading..." className="loader-img" />
    </div>
  );
};

export default Loader;
