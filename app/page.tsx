'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import WalletSvg from '@/public/components/walletSvg'

type ThoughtEntry = {
  timestamp: Date
  type?: undefined
  content: string
}

type ActionEntry = {
  timestamp: Date
  type: 'create_wallet' | 'deploy_token' | 'transfer_token' | 'swap_token'
  content: string
}

type StreamEntry = ThoughtEntry | ActionEntry

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
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([])
  const [userInput, setUserInput] = useState('')
  const [animatedData, setAnimatedData] = useState<AnimatedData>({
    earned: 10000,
    spent: 4000,
    staked: 1000,
    transactions: 0,
    thoughts: 900
  })
  const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 })
  const avatarRef = useRef<SVGSVGElement>(null)
  const [walletBalance, setWalletBalance] = useState(5000) // Initial wallet balance

  const agentName = "Based Agent"
  const agentWallet = "0x1234...5678"
  const agentBio = "I exist to make the Internet fun again."

  useEffect(() => {
    setCurrentTime(new Date())

    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const streamInterval = setInterval(() => {
      const newEntry = Math.random() > 0.3 ? generateRandomThought() : generateRandomAction()
      setStreamEntries((prevEntries) => [...prevEntries, newEntry].slice(-10))
      setAnimatedData((prev) => ({
        ...prev,
        thoughts: prev.thoughts + (newEntry.type === undefined ? 1 : 0),
        transactions: prev.transactions + (newEntry.type !== undefined ? 1 : 0)
      }))
    }, 3000)

    const dataInterval = setInterval(() => {
      setAnimatedData((prev) => ({
        earned: prev.earned + Math.random() * 10,
        spent: prev.spent + Math.random() * 5,
        staked: prev.staked + Math.random() * 2,
        transactions: prev.transactions,
        thoughts: prev.thoughts
      }))
      // Update wallet balance
      setWalletBalance((prev) => prev + (Math.random() - 0.5) * 100)
    }, 2000)

    return () => {
      clearInterval(cursorInterval)
      clearInterval(timeInterval)
      clearInterval(streamInterval)
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

  const formatThailandDate = (date: Date) => {
    return date.toLocaleString('en-US', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      formatMatcher: 'basic'
    }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')
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

  const generateRandomAction = (): ActionEntry => {
    const actions = [
      { type: 'create_wallet', content: 'Created new wallet' },
      { type: 'deploy_token', content: 'Deployed new ERC-20 token' },
      { type: 'deploy_token', content: 'Deployed new NFT collection' },
      { type: 'transfer_token', content: 'Transferred 100 USDT to 0x1234...5678' },
      { type: 'transfer_token', content: 'Transferred NFT #1234 to 0x5678...9012' },
      { type: 'swap_token', content: 'Swapped 10 ETH for 15000 USDT' },
    ] as const
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    return {
      timestamp: new Date(),
      type: randomAction.type,
      content: randomAction.content
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agentWallet)
      .then(() => {
        console.log('Wallet address copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy wallet address: ', err)
      })
  }

  const renderStreamEntry = (entry: StreamEntry, index: number) => {
    if ('type' in entry) {
      // Action entry
      const getIcon = () => {
        switch (entry.type) {
          case 'create_wallet':
            return <WalletSvg />
          case 'deploy_token':
            return <WalletSvg />
          case 'transfer_token':
            return <WalletSvg />
          case 'swap_token':
            return <WalletSvg />
        }
      }

      return (
        <div key={index} className="mb-2">
          <div className="text-xs text-gray-500">{formatThailandDate(entry.timestamp)}</div>
          <div className="flex items-center">
            {getIcon()}
            <span className="pl-2">{entry.content}</span>
          </div>
        </div>
      )
    } else {
      // Thought entry
      return (
        <div key={index} className="mb-2">
          <div className="text-xs text-gray-500">{formatThailandDate(entry.timestamp)}</div>
          <div className="text-gray-300">{entry.content}</div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black font-mono text-[#5788FA] relative overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-[#5788FA] relative z-10">
          <div className="text-sm" aria-live="polite">
            {currentTime ? `${formatThailandDate(currentTime)} ICT` : ''}
          </div>
          <button className="px-4 py-2 text-[#5788FA] border border-[#5788FA] rounded-none bg-black hover:bg-[#5788FA] hover:text-black transition-colors">
            Connect Wallet
          </button>
        </div>
        <div className="flex flex-grow overflow-hidden relative z-10">
          <div className="flex-grow flex flex-col">
            <div className="flex-grow p-4 overflow-y-auto">
              <p>Streaming real-time...</p>
              <div className="mt-4 space-y-2" role="log" aria-live="polite">
                {streamEntries.map((entry, index) => renderStreamEntry(entry, index))}
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#5788FA]">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-[#5788FA] text-[#5788FA] p-2 pr-24 resize-none placeholder-[#5788FA] placeholder-opacity-50"
                  placeholder="What's on your mind?"
                  rows={1}
                />
                <button
                  type="submit"
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-[#5788FA] text-black px-6 py-1.5 hover:bg-[#3D7BFF] transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          <div className="w-1/3 p-4 border-l border-[#5788FA] flex flex-col overflow-y-auto">
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
                    <button 
                      onClick={copyToClipboard} 
                      className="opacity-0 group-hover:opacity-100 p-0 h-4 w-4 hover:bg-transparent transition-opacity focus:outline-none"
                    >
                      <WalletSvg />
                      <span className="sr-only">Copy wallet address</span>
                    </button>
                  </div>
                  <p className="text-base text-[#5788FA]">{agentBio}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 bg-black border border-[#5788FA] rounded-none">
              <div className="flex flex-col items-start p-4">
                <span className="text-base text-[#5788FA]">Balance</span>
                <span className="text-2xl font-bold text-[#5788FA] mt-2">
                  ${walletBalance.toFixed(2)}
                </span>
                <ul className="space-y-1 pt-4">
                  <li>Earned: ${animatedData.earned.toFixed(2)}</li>
                  <li>Spent: ${animatedData.spent.toFixed(2)}</li>
                  <li>Staked: ${animatedData.staked.toFixed(2)}</li>
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}