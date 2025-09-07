import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!project) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b">
          <div className="mb-2 sm:mb-0">
            <h3 className="text-lg sm:text-xl font-semibold">{project.title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{project.description}</p>
          </div>
          <motion.button 
            onClick={onClose} 
            className="px-3 py-1.5 rounded-xl border hover:bg-gray-100 transition-colors self-end sm:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-50 grid grid-rows-[auto_1fr_auto]">
          <img src={project.preview || project.image} alt={project.title} className="w-full h-52 object-cover" />
          <iframe
            title={project.title}
            src={project.url}
            className="w-full h-full"
            allowFullScreen
          />
          <div className="p-3 border-t bg-white">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Live Demo
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
