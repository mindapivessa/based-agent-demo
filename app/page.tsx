'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'

type ThoughtEntry = {
  timestamp: Date
  content: string
}

type AnimatedData = {
  earned: number
  spent: number
  staked: number
  transactions: number
  thoughts: number
}

export default function Component() {
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [thoughts, setThoughts] = useState<ThoughtEntry[]>([])
  const [userInput, setUserInput] = useState('')
  const [animatedData, setAnimatedData] = useState<AnimatedData>({
    earned: 10000,
    spent: 4000,
    staked: 1000,
    transactions: 0,
    thoughts: 900
  })
  const [mounted, setMounted] = useState(false)
  const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 })
  const avatarRef = useRef<SVGSVGElement>(null)

  const agentName = "Based Agent"
  const agentWallet = "0x1234...5678"
  const agentBio = "I'm an AI agent specialized in data analysis and creative problem-solving."

  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const thoughtInterval = setInterval(() => {
      const newThought = generateRandomThought()
      setThoughts((prevThoughts) => [...prevThoughts, newThought].slice(-10))
      setAnimatedData((prev) => ({
        ...prev,
        thoughts: prev.thoughts + 1
      }))
    }, 3000)

    const dataInterval = setInterval(() => {
      setAnimatedData((prev) => ({
        earned: prev.earned + Math.random() * 10,
        spent: prev.spent + Math.random() * 5,
        staked: prev.staked + Math.random() * 2,
        transactions: prev.transactions + (Math.random() > 0.7 ? 1 : 0),
        thoughts: prev.thoughts
      }))
    }, 2000)

    return () => {
      clearInterval(cursorInterval)
      clearInterval(timeInterval)
      clearInterval(thoughtInterval)
      clearInterval(dataInterval)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (avatarRef.current) {
        const avatarRect = avatarRef.current.getBoundingClientRect()
        const avatarCenterX = avatarRect.left + avatarRect.width / 2
        const avatarCenterY = avatarRect.top + avatarRect.height / 2

        const dx = event.clientX - avatarCenterX
        const dy = event.clientY - avatarCenterY
        const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2

        const normalizedX = Math.min(Math.max((dx / maxDistance) * 30 + 50, 20), 80)
        const normalizedY = Math.min(Math.max((dy / maxDistance) * 30 + 50, 20), 80)

        setEyePosition({ x: normalizedX, y: normalizedY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const formatGMTDate = (date: Date) => {
    return date.toISOString().replace('T', ' ').slice(0, -5)
  }

  const generateRandomThought = (): ThoughtEntry => {
    const thoughts = [
      "Analyzing data patterns...",
      "Processing natural language input...",
      "Optimizing neural networks...",
      "Generating creative solutions...",
      "Evaluating ethical implications...",
      "Simulating complex scenarios...",
      "Integrating cross-domain knowledge...",
      "Refining machine learning models...",
      "Exploring innovative algorithms...",
      "Synthesizing information from multiple sources..."
    ]
    return {
      timestamp: new Date(),
      content: thoughts[Math.floor(Math.random() * thoughts.length)]
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('User input:', userInput)
    setUserInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-black font-mono text-[#5788FA]">
      <div className="p-4 flex items-center justify-between border-b border-[#5788FA]">
        <div className="text-sm" aria-live="polite">
          {mounted && currentTime ? `${formatGMTDate(currentTime)} GMT` : ''}
        </div>
        <button className="px-4 py-2 text-[#5788FA] border border-[#5788FA] rounded-none bg-black hover:bg-[#5788FA] hover:text-black transition-colors">
          Connect Wallet
        </button>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">
          <p>Streaming real-time...</p>
          {mounted && (
            <div className="mt-4 space-y-2" role="log" aria-live="polite">
              {thoughts.map((thought, index) => (
                <div key={index} className="flex">
                  <span className="mr-2 text-[#5788FA]">{formatGMTDate(thought.timestamp)}</span>
                  <span>{thought.content}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center mt-4">
            <span className="mr-2">$</span>
            <span className="relative">
              <span className="invisible">_</span>
              <span
                className={`absolute left-0 top-0 h-5 w-2 bg-[#5788FA] ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              ></span>
            </span>
          </div>
        </div>
        <div className="w-1/3 p-4 border-l border-[#5788FA] flex flex-col ">
          <div className="mb-4 bg-black border border-[#5788FA] rounded-none">
            <div className="flex flex-col items-start space-y-4 p-4">
              <svg
                ref={avatarRef}
                width="80"
                height="80"
                viewBox="0 0 100 100"
                className="bg-[#5788FA]"
                role="img"
                aria-label="Animated avatar"
              >
                <circle cx="50" cy="50" r="45" fill="#000000" />
                <circle cx={eyePosition.x} cy={eyePosition.y} r="5" fill="#5788FA" />
              </svg>
              <div className="space-y-2 text-left w-full">
                <h2 className="text-xl font-bold text-[#5788FA]">{agentName}</h2>
                <div className="flex items-center space-x-2 group">
                  <span className="text-sm text-[#5788FA] truncate max-w-[120px]">{agentWallet}</span>
                </div>
                <p className="text-base text-[#5788FA]">{agentBio}</p>
              </div>
            </div>
          </div>
          <div className="mb-4 p-4 border border-[#5788FA]">
            <ul className="space-y-1">
              <li>Earned: ${animatedData.earned.toFixed(2)}</li>
              <li>Spent: ${animatedData.spent.toFixed(2)}</li>
              <li>Staked: ${animatedData.staked.toFixed(2)}</li>
              <li>Actions: {animatedData.transactions}</li>
              <li>Thoughts: {animatedData.thoughts}</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <div className="relative flex-grow">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                className="w-full h-full bg-black border border-[#5788FA] text-[#5788FA] p-4 pb-12 resize-none placeholder-[#5788FA] placeholder-opacity-50"
                placeholder="What's on your mind?"
              />
              <button
                type="submit"
                className="absolute bottom-2 right-2 bg-[#5788FA] text-black px-6 py-1.5 hover:bg-[#3D7BFF] transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}