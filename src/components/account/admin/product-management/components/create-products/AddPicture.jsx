import Image from 'next/image';
import React from 'react'

const AddPicture = ({product, setProducts, productIndex, handleClosePicture}) => {
  

  //Add image and temporary URL state to preview before saving once uploaded
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImage = { file, url: imageUrl };

      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          image: newImage
        };
        return updatedProducts;
      });
    }
  };

  //Remove image function
  const removeImage = () => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        image: null
      };
      return updatedProducts;
    });
  };

  return (
    <div 
      className='absolute top-2 right-2 flex items-center justify-center cursor-pointer bg-blue-shadow9 font-bold p-5 rounded gap-3 shadow-lg z-10 '
    >
      <button 
        onClick={handleClosePicture}
        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
      >
        X
      </button>

      {product.name ? (
        <div className='flex-col flex items-center justify-center gap-2'>
          <span className='text-sm'>{product.name}</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAddImage} 
          />
    
          <div className='flex flex-col items-center h-24 w-24'>
            <Image
              src={product.image ? product.image.url : '/assets/shopping-bag.png'}
              alt="Selected"
              className={`${product?.image? 'w-24 h-24' : 'w-12 h-12'} object-cover mt-2 border rounded-full`}
              width={25}
              height={25}
            />
          </div>
          
          {product?.image && (
            <div className='text-sm text-text-gray flex gap-5'>
              <button
                onClick={() => handleClosePicture()}
                className="bg-brand-green text-white px-2 hover:shadow-md shadow-black py-2 rounded mt-2"
              >
                Save Picture
              </button>

              <button
                onClick={removeImage}
                className="bg-error text-white px-2 hover:shadow-md shadow-black py-2 rounded mt-2"
              >
                Remove Picture
              </button>
          </div>)}
        </div>
      ) : (
        <div className='font-semibold text-center text-error w-48'>
          <span>
            Please enter product name before adding a picture!!!
          </span>
        </div>
      )}

    </div>
  )
}

export default AddPicture;