import React from 'react';

const Button = ({ type, loading, loadingText, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={`${type || 'button'}`}
      disabled={loading}
      className={`h-10 bg-brand-blue rounded-md text-md text-white px-2 ${
        loading ? 'cursor-not-allowed' : 'hover:bg-blue-shadow1'
      } items-center justify-center`}
    >
      {loading ? (
        <>
          <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
          <span>{loadingText}</span>
        </>
      ) : (
        `${text || 'Submit'}`
      )}
    </button>
  );
};

export default Button;
