import React from 'react'

const Header = () => {
  return (
    <div className='h-[5vh] flex justify-end items-center gap-5 w-full py-7 bg-text-white'>
        <div>Searchbar</div>
        <div className='flex flex-row justify-between items-center gap-5'>
            <p>notification bell</p>
            <p>profile pic</p>
            <p>name</p>
        </div>
    </div>
  )
}

export default Header;