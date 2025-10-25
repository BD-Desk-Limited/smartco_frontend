import Image from 'next/image';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const showPageNumbers = () => {
    let pageNumbers=[];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          className={i === currentPage ? 'font-bold px-3 py-1 bg-brand-blue rounded-full text-white' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  }

  return (<>{totalPages > 1 && 
    <div className="flex flex-row justify-center items-center gap-5">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        <Image
          src="/assets/prev_blue.png"
          alt="Previous"
          width={24}
          height={24}
        />
      </button>

      <span className='gap-5 flex flex-row justify-center items-center'>
        {showPageNumbers()}
      </span>

      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <Image
          src="/assets/next_blue.png"
          alt="Next"
          width={24}
          height={24}
        />
      </button>
    </div>
}</>);
}

export default Pagination;