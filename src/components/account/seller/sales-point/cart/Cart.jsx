import React, { useState, useRef, useEffect } from 'react';

const Cart = ({
  cartItems,
  setCartItems,
  handleScan,
  scannedId,
  setScannedId,
  scanMode,
  searchRef,
  filterRef,
  workBranch,
}) => {
  const inputRef = useRef(null);

  // always focus scanMode
  useEffect(() => {
    if (scanMode && workBranch) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
    }
  }, [scanMode, workBranch]);

  console.log('CART:', cartItems);

  return (
    <div>
      {/* Scanner input */}
      <input
        type="text"
        value={scannedId}
        onChange={(e) => setScannedId(e.target.value)}
        onKeyDown={handleScan}
        ref={inputRef}
        onBlur={(e) => {
          if (
            scanMode &&
            e.relatedTarget !== searchRef.current &&
            e.relatedTarget !== filterRef.current
          ) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        style={{ position: 'absolute', left: '-9999px' }}
      />
      Cart with {cartItems?.length} products
      {}
    </div>
  );
};

export default Cart;
