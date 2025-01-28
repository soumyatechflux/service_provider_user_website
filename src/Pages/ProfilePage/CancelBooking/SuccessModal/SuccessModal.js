const SuccessModal = ({ isOpen, onClose, message, isSuccess }) => {
  const handleCloseAndNavigate = () => {
    onClose(); 
    window.location.reload();
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center py-4">
            <div className="mb-3">
              <span role="img" aria-label="success" style={{ fontSize: '2rem', color: isSuccess ? 'green' : 'red' }}>
                {isSuccess ? '✔️' : '✖️'}
              </span>
            </div>
            <h5 className="mb-3">{isSuccess ? 'Booking Cancelled!' : 'Error!'}</h5>
            <p className="text-muted mb-4">{message}</p>
            <button className="btn btn-primary px-4" onClick={handleCloseAndNavigate}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
