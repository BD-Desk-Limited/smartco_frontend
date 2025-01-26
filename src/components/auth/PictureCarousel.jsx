import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const pictures = [
  '/assets/picture1.jpg',
  '/assets/picture2.jpg',
  '/assets/picture3.jpg',
  '/assets/picture4.jpg',
  '/assets/picture5.jpg',
];

const PictureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-[10%]">
      <Image
        src={pictures[currentIndex]}
        alt={`Picture ${currentIndex + 1}`}
        layout="fill"
        objectFit="cover"
        className="rounded-[10%] z-20"
      />
      <div className="absolute inset-0 bg-brand-blue opacity-[73%] rounded-[10%] z-30"></div>
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <Image
          src="/assets/logo_white.png"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
      <div className="absolute bottom-[20vh] z-10 right-[-15vw]">
        <Image
          src="/assets/brand_mark2.png"
          alt="Logo"
          width={600}
          height={600}
        />
      </div>
      <div className="absolute bottom-[-8vh] right-[-5vw] z-40">
        <Image
          src="/assets/brand_mark1.png"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default PictureCarousel;
