import React from 'react'

const AddDescription = ({product, setProducts, productIndex, handleCloseDescription}) => {

  // handle description change
  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setProducts(prev => {
      const updatedProducts = [...prev];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        description: value
      };
      return updatedProducts;
    });
  };

  return (
    <div className='bg-brand-blue rounded-lg w-full flex flex-col gap-2 relative'>

      {/* close button */}
      <div className='absolute top-2 right-2 bg-text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-red-300 font-bold'>
        <button 
          className='text-error' 
          onClick={() => handleCloseDescription(productIndex)}
        >
          X
        </button>
      </div>

      {/* Product Description */}
      <span className='flex items-center justify-center text-text-white font-semibold py-2s'>
        Product Description
      </span>

      <textarea 
        className='w-full min-h-40 border-dashed border-2 border-brand-blue rounded flex items-center justify-center cursor-pointer p-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-blue resize-none' 
        rows={4} 
        value={product.description || ''}
        placeholder='Enter product description here...'
        onChange={handleDescriptionChange}
      >
      </textarea>
    </div>
  );
}

export default AddDescription;