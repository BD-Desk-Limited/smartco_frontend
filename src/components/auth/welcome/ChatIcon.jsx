import React from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';

const ChatIcon = () => {
  return (
    <motion.div
        className='absolute bottom-3 right-8 cursor-pointer'
        animate={{
            y: [0, -15, 5], // Moves the button up and down to create a bounce
        }}
        transition={{
            duration: 0.8,
            repeat: Infinity, 
            repeatType: "loop", 
            ease: "easeInOut",  
        }}
    >
        <Image src='/assets/chatbox.png' alt='' width={80} height={80} />
    </motion.div>
  );
}

export default ChatIcon;