import { motion } from 'framer-motion'

export default function Cartoon({ jumping }) {
  return (
    <motion.div
      className="fixed right-4 bottom-4 md:right-8 md:bottom-8 select-none"
      animate={jumping ? { y: -18 } : { y: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
    >
      <div className="relative">
        {/* Character */}
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head */}
          <circle cx="90" cy="50" r="30" fill="#F8D3B8" stroke="#333" strokeWidth="2" />
          
          {/* Hair */}
          <path d="M70 35 Q80 20 110 35" stroke="#6B4226" strokeWidth="8" fill="#6B4226" />
          
          {/* Eyes */}
          <circle cx="80" cy="45" r="4" fill="#333" />
          <circle cx="100" cy="45" r="4" fill="#333" />
          
          {/* Smile */}
          <path d="M80 60 Q90 70 100 60" stroke="#333" strokeWidth="2" fill="none" />
          
          {/* Body */}
          <rect x="75" y="80" width="30" height="40" fill="#E74C3C" rx="5" />
          
          {/* Arms */}
          <path d="M75 85 L55 100" stroke="#F8D3B8" strokeWidth="10" strokeLinecap="round" />
          <path d="M105 85 L125 95" stroke="#F8D3B8" strokeWidth="10" strokeLinecap="round" />
          
          {/* Legs */}
          <path d="M80 120 L75 150" stroke="#3F51B5" strokeWidth="15" strokeLinecap="round" />
          <path d="M100 120 L105 150" stroke="#3F51B5" strokeWidth="15" strokeLinecap="round" />
          
          {/* Shoes */}
          <ellipse cx="70" cy="155" rx="10" ry="5" fill="#333" />
          <ellipse cx="110" cy="155" rx="10" ry="5" fill="#333" />
        </svg>
      </div>
    </motion.div>
  )
}
