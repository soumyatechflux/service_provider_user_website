import React from 'react';
import LoaderGif from './Animation.gif';

const Loader = () => (
  <div style={loaderStyles.container}>
    <img src={LoaderGif} alt="Loading..." style={loaderStyles.modal} />
  </div>
);

const loaderStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    maxWidth: '90px',
    maxHeight: '90px',
  },
};

export default Loader;