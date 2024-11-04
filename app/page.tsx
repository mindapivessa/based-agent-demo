'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import WalletSvg from '@/public/components/walletSvg'
import SendSvg from '@/public/components/sendSvg'
import RequestSvg from '@/public/components/requestSvg'
import SwapSvg from '@/public/components/swapSvg'
import NftSvg from '@/public/components/nftSvg'
import TokenSvg from '@/public/components/tokenSvg'
import CopySvg from '@/public/components/copySvg'
import dynamic from 'next/dynamic'


type ThoughtEntry = {
  timestamp: Date
  type?: undefined
  content: string
}

type ActionEntry = {
  timestamp: Date
  type: 'create_wallet' | 'request_faucet_funds' | 'get_balance' | 'swap_token' | 'transfer_token' | 'transfer_nft' | 'user'
  content: string
}

type StreamEntry = ThoughtEntry | ActionEntry

type AnimatedData = {
  earned: number
  spent: number
  nftsOwned: number
  tokensOwned: number
  transactions: number
  thoughts: number
}

// Create a client-only time component
const TimeDisplay = dynamic(() => Promise.resolve(({ currentTime }: { currentTime: Date }) => (
  <div className="text-sm" aria-live="polite">
    {currentTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      formatMatcher: 'basic'
    }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')} ICT
  </div>
)), { ssr: false })

export default function Component() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [streamEntries, setStreamEntries] = useState<StreamEntry[]>([])
  const [userInput, setUserInput] = useState('')
  const [animatedData, setAnimatedData] = useState<AnimatedData>({
    earned: 10000,
    spent: 4000,
    nftsOwned: 3,
    tokensOwned: 0,
    transactions: 0,
    thoughts: 900
  })
  const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 })
  const avatarRef = useRef<SVGSVGElement>(null)
  const [walletBalance, setWalletBalance] = useState(5000) // Initial wallet balance
  const [isThinking, setIsThinking] = useState(true)
  const [loadingDots, setLoadingDots] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

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
      setIsThinking(true)
      setTimeout(() => {
        const newEntry = Math.random() > 0.3 ? generateRandomThought() : generateRandomAction()
        setStreamEntries((prevEntries) => [...prevEntries, newEntry].slice(-10))
        setAnimatedData((prev) => ({
          ...prev,
          thoughts: prev.thoughts + (newEntry.type === undefined ? 1 : 0),
          transactions: prev.transactions + (newEntry.type !== undefined ? 1 : 0)
        }))
        setIsThinking(false)
      }, 1500) // Delay to show thinking state
    }, 3000)

    const dataInterval = setInterval(() => {
      setAnimatedData((prev) => ({
        earned: prev.earned + Math.random() * 10,
        spent: prev.spent + Math.random() * 5,
        nftsOwned: prev.nftsOwned + (Math.random() > 0.95 ? 1 : 0),
        tokensOwned: prev.tokensOwned + (Math.random() > 0.98 ? 1 : 0),
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

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    return () => clearInterval(dotsInterval)
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
    ]
    return {
      timestamp: new Date(),
      content: thoughts[Math.floor(Math.random() * thoughts.length)]
    }
  }

  const generateRandomAction = (): ActionEntry => {
    const actions = [
      { type: 'create_wallet', content: 'Created a new wallet 0x453b...3432' },
      { type: 'request_faucet_funds', content: 'Requested and received 0.01 ETH from the faucet' },
      { type: 'get_balance', content: '0x4534...d342\'s balance is 1003.45 USDC' },
      { type: 'transfer_token', content: 'Transferred 100 USDC to 0x1234...5678' },
      { type: 'transfer_nft', content: 'Transferred NFT #1234 to 0x5678...9012' },
      { type: 'swap_token', content: 'Swapped 10 ETH for 15000 USDC' },
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
    if (!userInput.trim()) return

    const userMessage: ActionEntry = {
      timestamp: new Date(),
      type: 'user',
      content: userInput.trim()
    }
    
    setStreamEntries(prev => [...prev, userMessage].slice(-10))
    setUserInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(agentWallet)
      .then(() => {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 2000) // Hide toast after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy wallet address: ', err)
      })
  }

  const renderStreamEntry = (entry: StreamEntry, index: number) => {
    if ('type' in entry) {
      if (entry.type === 'user') {
        return (
          <div key={index} className="mb-2 flex flex-col items-end">
            <div className="text-xs text-gray-500">You at {formatThailandDate(entry.timestamp)}</div>
            <div className="text-[#5788FA] max-w-[80%]">
              {entry.content}
            </div>
          </div>
        )
      }
      // Action entry
      const getIcon = () => {
        switch (entry.type) {
          case 'create_wallet':
            return <WalletSvg />
          case 'request_faucet_funds':
            return <RequestSvg />
          case 'get_balance':
            return <WalletSvg />
          case 'swap_token':
            return <SwapSvg />
          case 'transfer_nft':
            return <NftSvg />
          case 'transfer_token':
            return <TokenSvg />
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
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#5788FA] relative z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#5788FA] p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <TimeDisplay currentTime={currentTime} />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
          <span className="text-zinc-50 text-sm">Live on Base Sepolia</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left side - Profile and Stats Cards */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:relative
          w-full lg:w-1/3 
          h-full
          bg-black
          z-20 lg:z-0
          transition-transform
          duration-300
          p-4 lg:border-r lg:border-[#5788FA] 
          flex flex-col 
          overflow-y-auto
        `}>
          <div className="mb-4 bg-black border border-[#5788FA] rounded-sm">
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
                <div className="relative inline-flex items-center group">
                  <button 
                    onClick={copyToClipboard}
                    className="text-sm text-[#5788FA] hover:text-[#3D7BFF] transition-colors"
                  >
                    {agentWallet}
                  </button>
                  {showToast && (
                    <div className="absolute top-full left-0 mt-2 bg-[#5788FA] text-black text-xs px-2 py-1 rounded-xs">
                      Copied
                    </div>
                  )}
                </div>
                <p className="text-base text-[#5788FA]">{agentBio}</p>
              </div>
            </div>
          </div>
          <div className="mb-4 bg-black border border-[#5788FA] rounded-sm">
            <div className="flex flex-col items-start p-4">
              <span className="text-2xl font-bold text-[#5788FA]">
                ${walletBalance.toFixed(2)}
              </span>
              <ul className="space-y-1 pt-4">
                <li>Earned: ${animatedData.earned.toFixed(2)}</li>
                <li>Spent: ${animatedData.spent.toFixed(2)}</li>
                <li>NFTs: {animatedData.nftsOwned}</li>
                <li>Tokens: {animatedData.tokensOwned}</li>
                <li>Transactions: {animatedData.transactions}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Stream and Chat */}
        <div className="flex-grow flex flex-col w-full lg:w-2/3">
          <div className="flex-grow p-4 pb-40 overflow-y-auto">
            <p className="text-zinc-600">Streaming real-time...</p>
            <div className="mt-4 space-y-2" role="log" aria-live="polite">
              {streamEntries.map((entry, index) => renderStreamEntry(entry, index))}
            </div>
            {isThinking && (
              <div className="flex items-center mt-4 text-[#5788FA] opacity-70">
                <span className="font-mono">Agent is thinking{loadingDots}</span>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="fixed bottom-0 right-0 w-full lg:w-2/3 border-t border-[#5788FA] bg-black">
            <div className="relative">
              <textarea
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full h-24 lg:h-36 bg-black text-[#5788FA] p-4 pr-10 placeholder-[#5788FA] placeholder-opacity-50"
                placeholder="How can I help?"
                rows={1}
              />
              <div className="px-2 absolute bottom-0.5 right-0 flex items-center justify-between w-full -translate-y-1/2">
                <div className="flex space-x-2 text-xs lg:text-sm ml-2 overflow-x-auto">
                  <button 
                    onClick={() => setUserInput("Send 5 USDC to jesse.base.eth")}
                    className="text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm"
                  >
                    Send 5 USDC to jesse.base.eth
                  </button>
                  <button 
                    onClick={() => setUserInput("Create a new wallet with 10 USDC")}
                    className="text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm"
                  >
                    Create a new wallet with 10 USDC
                  </button>
                  <button 
                    onClick={() => setUserInput("Create a new wallet with 10 USDC")}
                    className="text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm"
                  >
                    What are my trading positions?
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-[#5788FA] text-black p-1.5 hover:bg-[#3D7BFF] transition-colors rounded-sm"
                >
                  <SendSvg />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}