import React from 'react';
import noInternetImage from './noInternet.jpeg';

const InternetChecker = () => {
  const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  };

  const imageStyle = {
    maxWidth: '80%',
    maxHeight: '80%',
    borderRadius: '10px',
  };

  return (
    <div style={modalStyle}>
      <img src={noInternetImage} alt="No Internet" style={imageStyle} />
    </div>
  );
}

export default InternetChecker;
