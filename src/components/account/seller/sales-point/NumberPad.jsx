import React from 'react';
import { FaBackspace } from 'react-icons/fa';

const NumberPad = ({ value, assignValueFunction, themeMode = 'light' }) => {
  const [number, setNumber] = React.useState(value || '');
  const OnNumberClick = (num) => {
    if (!buttons.map((bt) => bt.value).includes(num)) {
      return; // If the clicked value is not in the buttons array, do nothing
    }
    if (num === '.' && number.includes('.')) return;

    if (num === 'delete') {
      setNumber((prev) => prev.slice(0, -1));
      return;
    }

    if (num === 'clear') {
      setNumber('');
      return;
    }

    setNumber((prev) => {
      if (num === '.' && prev === '') return '0.';
      return `${prev}${num}`;
    });
  };

  const buttons = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '.', value: '.' },
    { label: '0', value: '0' },
    {
      label: 'Delete',
      value: 'delete',
      icon: <FaBackspace className="text-lg" />,
    },
    { label: 'Clear', value: 'clear', className: 'col-span-3' },
  ];

  // Whenever the number state changes, call the assignValue function passed as a prop with the new number
  React.useEffect(() => {
    assignValueFunction(number);
  }, [number, assignValueFunction]);

  React.useEffect(() => {
    setNumber(value || '');
  }, [value]);

  return (
    <ul
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
      }}
    >
      {buttons.map((button) => (
        <li
          key={button.value}
          onClick={() => OnNumberClick(button.value)}
          style={{
            padding: '0.5rem',
            backgroundColor: themeMode === 'dark' ? '#1f2937' : '#e5e7eb',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            height: '2.5rem',
            width: '100%',
            transition: 'background-color 0.2s',
            ...(button.className ? {} : {}),
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              themeMode === 'dark' ? '#374151' : '#d1d5db')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              themeMode === 'dark' ? '#1f2937' : '#e5e7eb')
          }
        >
          {button.icon ? button.icon : button.label}
        </li>
      ))}
    </ul>
  );
};

export default NumberPad;
