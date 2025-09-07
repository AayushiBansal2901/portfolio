import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cartoon from './components/cartoon'
import SectionNav from './components/SectionNav'
import ProjectModal from './components/ProjectModal'
import { projects } from './data/projects'

export default function App() {
  const sections = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'projects', label: 'Projects' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' }
    ],
    []
  )

  const [index, setIndex] = useState(0)
  const [jumping, setJumping] = useState(false)
  const [modal, setModal] = useState({ open: false, project: null })
  const refs = useRef({})

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const i = sections.findIndex((s) => s.id === visible.target.id)
        if (i !== -1 && i !== index) {
          setIndex(i)
          setJumping(true)
          setTimeout(() => setJumping(false), 650)
        }
      },
      { threshold: [0.4, 0.6, 0.8] }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections, index])

  function scrollTo(i) {
    const id = sections[i]?.id
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-gray-800">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-30 backdrop-blur bg-white/60 border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">PORTFOLIO</div>
          <nav className="hidden md:flex gap-6 text-sm">
            {sections.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => scrollTo(i)}
                className={`transition-colors ${
                  index === i ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {s.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Cartoon Mascot + Section Nav */}
      <Cartoon jumping={jumping} />
      <SectionNav index={index} sections={sections} onSelect={scrollTo} />

      {/* Sections */}
      <motion.section 
        id="home" 
        className="h-screen flex items-center justify-center py-10 px-4 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl w-full mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-2">Aayushi Bansal</motion.h1>
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-700 mb-6">I am a frontend developer</motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">About Me</h2>
              <div className="flex flex-col space-y-3">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="mr-2">💻</span>
                  <span>Web Developer</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="mr-2">✨</span>
                  <span>Enthusiastic</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <span className="mr-2">⚙️</span>
                  <span>Problem Solver</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        id="about" 
        className="min-h-screen flex items-center justify-center py-10 px-4 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl w-full text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-4"
            variants={fadeInUp}
          >
            About Me
          </motion.h2>
          <motion.p 
            className="text-gray-700 leading-relaxed bg-white/70 p-4 sm:p-6 rounded-xl shadow-md"
            variants={fadeInUp}
          >
            I am a B.Tech CSE 3rd year student at State Institute of Engineering & Technology, Nilokheri. 
            I'm passionate about frontend development and creating interactive user experiences. 
            I enjoy working with modern web technologies and frameworks to build responsive and 
            user-friendly applications.
          </motion.p>
        </div>
      </motion.section>

      <motion.section 
        id="projects" 
        className="min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold mb-6"
          variants={fadeInUp}
        >
          Projects
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl px-4"
          variants={staggerContainer}
        >
          {projects.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer transition-all duration-300"
              onClick={() => setModal({ open: true, project: p })}
              variants={fadeInUp}
            >
              <img src={p.image} alt={p.title} className="rounded-lg mb-3 w-full" />
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{p.short}</p>
              <motion.button 
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Visit
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section 
        id="education" 
        className="min-h-screen flex items-center justify-center py-10 px-4 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl w-full text-center">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-4"
            variants={fadeInUp}
          >
            Education
          </motion.h2>
          <motion.ul 
            className="space-y-4 text-gray-700 bg-white/70 p-4 sm:p-6 rounded-xl shadow-md"
            variants={staggerContainer}
          >
            <motion.li
              variants={fadeInUp}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              🎓 B.Tech CSE (3rd Year) — State Institute of Engineering & Technology, Nilokheri
            </motion.li>
            <motion.li
              variants={fadeInUp}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              📘 Higher Secondary — PCM Background
            </motion.li>
          </motion.ul>
        </div>
      </motion.section>

      <motion.section 
        id="contact" 
        className="min-h-screen flex items-center justify-center py-10 px-4 sm:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl w-full px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
            variants={fadeInUp}
          >
            Contact
          </motion.h2>
          <motion.div 
            className="mb-6 text-center"
            variants={fadeInUp}
          >
            <p className="text-gray-700 mb-4">aayushi.bansal@example.com</p>
            <div className="flex justify-center space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-700 hover:text-indigo-600"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-700 hover:text-indigo-600"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-700 hover:text-indigo-600"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
          <motion.div 
            className="flex justify-center"
            variants={fadeInUp}
          >
            <motion.a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeAi4MP3dVd_k8TEtTedbO9cb7NHjNGNOUU3NF95_Dy029wLQ/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Project Modal */}
      <AnimatePresence>
        {modal.open && (
          <ProjectModal project={modal.project} onClose={() => setModal({ open: false, project: null })} />
        )}
      </AnimatePresence>
    </div>
  )
}
