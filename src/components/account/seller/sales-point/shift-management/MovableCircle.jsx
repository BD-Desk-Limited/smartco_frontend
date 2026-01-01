import { useRef, useState } from 'react';

const MovableCircle = ({ setMinimized }) => {
  const boxRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 500 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setDragging(true);
    const rect = boxRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    boxRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    // Clamp to viewport
    const boxWidth = boxRef.current.offsetWidth;
    const boxHeight = boxRef.current.offsetHeight;
    const maxX = window.innerWidth - boxWidth;
    const maxY = window.innerHeight - boxHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={boxRef}
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyItems: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: dragging ? 'grabbing' : 'grab',
        boxShadow: dragging
          ? '0 4px 8px rgba(0,0,0,0.3)'
          : '0 2px 4px rgba(0,0,0,0.2)',
        position: 'fixed',
        left: position.x,
        top: position.y,
        userSelect: 'none',
        zIndex: 9999,
        transition: dragging ? 'none' : 'box-shadow 0.2s',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="bg-brand-blue drop-shadow-lg rounded-full text-white font-semibold"
      onClick={() => setMinimized(false)}
    >
      My Shift
    </div>
  );
};

export default MovableCircle;
