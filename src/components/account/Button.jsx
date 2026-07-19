import React from 'react';

const Button = ({
  type,
  loading,
  loadingText,
  text,
  onClick,
  buttonStyle,
  children,
  icon,
  iconAfterText,
  iconStyle,
}) => {
  const renderIcon = () => {
    const Icon = icon; // capitalize so JSX treats it as a component
    return icon ? <Icon className={iconStyle || ''} /> : null;
  };

  return (
    <button
      onClick={onClick}
      type={`${type || 'button'}`}
      disabled={loading}
      className={`h-10 rounded-md text-md text-white px-2 ${
        loading ? 'cursor-not-allowed' : 'hover:bg-blue-shadow1'
      } items-center justify-center bg-brand-blue ${buttonStyle} shadow-md flex items-center justify-center`}
    >
      {loading ? (
        <>
          <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
          <span>{loadingText}</span>
        </>
      ) : children ? (
        children
      ) : (
        <span className="flex flex-row justify-center items-center gap-2">
          {!iconAfterText && <span>{renderIcon()}</span>}
          {text !== '' && <span>{text || 'Submit'}</span>}
          {iconAfterText && <span>{renderIcon()}</span>}
        </span>
      )}
    </button>
  );
};

export default Button;
