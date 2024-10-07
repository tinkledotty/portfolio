"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useAnimation } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from "../components/ui/button"
import Image from "next/image"

const projects = [
  { 
    id: 1, 
    title: "Project 1", 
    description: "A brief description of Project 1",
    image: "/placeholder.svg?height=200&width=300"
  },
  { 
    id: 2, 
    title: "Project 2", 
    description: "A brief description of Project 2",
    image: "/placeholder.svg?height=200&width=300"
  },
  { 
    id: 3, 
    title: "Project 3", 
    description: "A brief description of Project 3",
    image: "/placeholder.svg?height=200&width=300"
  },
]

const StarTrail = ({ x, y }: { x: number; y: number }) => {
  const controls = useAnimation()

  useEffect(() => {
    const animateTrail = async () => {
      await controls.start({
        opacity: [1, 0],
        scale: [0, 1],
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        transition: { duration: 0.5 }
      })
    }
    animateTrail()
  }, [x, y, controls])

  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{ x, y }}
      animate={controls}
    />
  )
}

export default function Component() {
  const [activeSection, setActiveSection] = useState('home')
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([])
  const [cursorVariant, setCursorVariant] = useState("default")

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX - 16)
    cursorY.set(e.clientY - 16)
    setTrails(prevTrails => [
      ...prevTrails.slice(-10),
      { id: Date.now(), x: e.clientX, y: e.clientY }
    ])
  }, [cursorX, cursorY])

  const checkCursorPosition = useCallback((e: MouseEvent) => {
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (element && (element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3')) {
      setCursorVariant("text")
    } else {
      setCursorVariant("default")
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousemove', checkCursorPosition)

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousemove', checkCursorPosition)
    }
  }, [moveCursor, checkCursorPosition])

  const [gradientAngle, setGradientAngle] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientAngle((prevAngle) => (prevAngle + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'contact']
      const scrollPosition = window.scrollY

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const cursorVariants = {
    default: {
      backgroundColor: "white",
      mixBlendMode: "normal" as const,
    },
    text: {
      backgroundColor: "white",
      mixBlendMode: "difference" as const,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-300 ease-in-out"
        style={{
          background: `linear-gradient(${gradientAngle}deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4), rgba(239, 68, 68, 0.4))`,
        }}
      />
      <motion.div
        className="w-8 h-8 rounded-full fixed pointer-events-none z-50"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        variants={cursorVariants}
        animate={cursorVariant}
      />
      {trails.map(trail => (
        <StarTrail key={trail.id} x={trail.x} y={trail.y} />
      ))}
      <header className="relative z-10 bg-black bg-opacity-20 backdrop-blur-sm fixed w-full">
        <nav className="container mx-auto px-6 py-3">
          <ul className="flex justify-center space-x-4">
            {['home', 'projects', 'contact'].map((section) => (
              <li key={section}>
                <Button
                  variant="link"
                  className={`text-white hover:text-gray-300 ${activeSection === section ? 'underline' : ''}`}
                  onClick={() => scrollToSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="relative z-10 pt-14">
        <section id="home" className="container mx-auto px-6 py-20 text-center min-h-screen flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to My Portfolio</h1>
          <p className="text-xl mb-8">I&apos;m a web developer passionate about creating beautiful and functional websites.</p>
        </section>
        <section id="projects" className="container mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8 text-center">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="contact" className="container mx-auto px-6 py-20 text-center min-h-screen flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-gray-300" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href="#" className="hover:text-gray-300" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
            <a href="#" className="hover:text-gray-300" aria-label="Email">
              <Mail size={24} />
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}