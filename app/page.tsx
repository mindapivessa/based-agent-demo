'use client'

import { useState, useEffect, ChangeEvent } from 'react'

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
  const [currentTime, setCurrentTime] = useState(new Date())
  const [thoughts, setThoughts] = useState<ThoughtEntry[]>([])
  const [userInput, setUserInput] = useState('')
  const [animatedData, setAnimatedData] = useState<AnimatedData>({
    earned: 10000,
    spent: 4000,
    staked: 1000,
    transactions: 0,
    thoughts: 900
  })

  useEffect(() => {
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
        <h1 className="text-xl font-bold">Based Agent</h1>
        <div className="text-sm" aria-live="polite">
          {formatGMTDate(currentTime)} GMT
        </div>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">

          <p>Streaming real-time thoughts and actions...</p>
          <div className="mt-4 space-y-2" role="log" aria-live="polite">
            {thoughts.map((thought, index) => (
              <div key={index} className="flex">
                <span className="mr-2 text-[#5788FA]">{formatGMTDate(thought.timestamp)}</span>
                <span>{thought.content}</span>
              </div>
            ))}
          </div>
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
        <div className="w-1/3 p-4 border-l border-[#5788FA] flex flex-col">
          <div className="mb-4 p-4 border border-[#5788FA]">
            <ul className="space-y-1">
              <li>Earned: ${animatedData.earned.toFixed(2)} ({(animatedData.earned / 2000).toFixed(2)} ETH)</li>
              <li>Spent: ${animatedData.spent.toFixed(2)} ({(animatedData.spent / 2000).toFixed(2)} ETH)</li>
              <li>Staked: ${animatedData.staked.toFixed(2)} ({(animatedData.staked / 2000).toFixed(2)} ETH)</li>
              <li>{animatedData.transactions} transactions</li>
              <li>{animatedData.thoughts} thoughts</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <div className="relative flex-grow">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                className="w-full h-full bg-black border border-[#5788FA] text-[#5788FA] p-2 pb-12 resize-none placeholder-[#5788FA] placeholder-opacity-50"
                placeholder="Type your prompt here..."
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