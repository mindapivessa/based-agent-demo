'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import WalletSvg from '@/public/components/walletSvg'
import SendSvg from '@/public/components/sendSvg'
import RequestSvg from '@/public/components/requestSvg'
import SwapSvg from '@/public/components/swapSvg'
import NftSvg from '@/public/components/nftSvg'
import TokenSvg from '@/public/components/tokenSvg'
import LanguageSelector from '@/public/components/LanguageSelector'
import { translations } from '@/app/translations'
import { Noto_Sans_Thai } from 'next/font/google'

const notoSansThai = Noto_Sans_Thai({
  weight: ['400', '700'],
  subsets: ['thai'],
})

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

type Language = 'en' | 'th' | 'zh'

export default function Component() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cursorVisible, setCursorVisible] = useState(true)
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
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [isLiveDotVisible, setIsLiveDotVisible] = useState(true)

  const agentName = "Based Agent"
  const agentWallet = "0x1234...5678"

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

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
      }, 1500)
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
      setWalletBalance((prev) => prev + (Math.random() - 0.5) * 100)
    }, 2000)

    return () => {
      clearInterval(cursorInterval)
      clearInterval(streamInterval)
      clearInterval(dataInterval)
    }
  }, [currentLang])

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

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setIsLiveDotVisible(prev => !prev)
    }, 1000)

    return () => clearInterval(dotInterval)
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
      translations[currentLang].thoughts.analyzing,
      translations[currentLang].thoughts.processing,
      translations[currentLang].thoughts.optimizing,
      translations[currentLang].thoughts.generating,
      translations[currentLang].thoughts.evaluating,
      translations[currentLang].thoughts.simulating,
    ]
    return {
      timestamp: new Date(),
      content: thoughts[Math.floor(Math.random() * thoughts.length)]
    }
  }

  const generateRandomAction = (): ActionEntry => {
    const actions = [
      { 
        type: 'create_wallet' as const, 
        content: `${translations[currentLang].actions.createWallet} 0x453b...3432` 
      },
      { 
        type: 'request_faucet_funds' as const, 
        content: translations[currentLang].actions.requestFunds 
      },
      { 
        type: 'get_balance' as const, 
        content: `0x4534...d342${translations[currentLang].actions.getBalance} 1003.45 USDC` 
      },
      { 
        type: 'transfer_token' as const, 
        content: `${translations[currentLang].actions.transferToken} 100 USDC ${translations[currentLang].actions.to} 0x1234...5678` 
      },
      { 
        type: 'transfer_nft' as const, 
        content: `${translations[currentLang].actions.transferNft} #1234 ${translations[currentLang].actions.to} 0x5678...9012` 
      },
      { 
        type: 'swap_token' as const, 
        content: `${translations[currentLang].actions.swapToken} 10 ETH ${translations[currentLang].actions.to} 15000 USDC` 
      },
    ]
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
            <div className={`text-xs text-gray-500 ${currentLang === 'th' ? notoSansThai.className : ''}`}>
              {translations[currentLang].stream.youAt} {formatThailandDate(entry.timestamp)}
            </div>
            <div className={`text-[#5788FA] max-w-[80%] ${currentLang === 'th' ? notoSansThai.className : ''}`}>
              {entry.content}
            </div>
          </div>
        )
      }
      // Action entry
      const getIcon = () => {
        switch (entry.type) {
          case 'create_wallet':
            return <div className="w-4 h-4"><WalletSvg /></div>
          case 'request_faucet_funds':
            return <div className="w-4 h-4"><RequestSvg /></div>
          case 'get_balance':
            return <div className="w-4 h-4"><WalletSvg /></div>
          case 'swap_token':
            return <div className="w-4 h-4"><SwapSvg /></div>
          case 'transfer_nft':
            return <div className="w-4 h-4"><NftSvg /></div>
          case 'transfer_token':
            return <div className="w-4 h-4"><TokenSvg /></div>
        }
      }

      return (
        <div key={index} className="mb-2">
          <div className="text-xs text-gray-500">{formatThailandDate(entry.timestamp)}</div>
          <div className={`flex items-center ${currentLang === 'th' ? notoSansThai.className : ''}`}>
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
          <div className={`text-gray-300 ${currentLang === 'th' ? notoSansThai.className : ''}`}>
            {entry.content}
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    // Clear stream entries when language changes
    setStreamEntries([])
  }, [currentLang])

  return (
    <div className="flex flex-col h-screen bg-black font-mono text-[#5788FA] relative overflow-hidden">
      {/* Header with smoother animated dot */}
      <div className="flex justify-between items-center p-4 border-b border-[#5788FA]">
        <div className="flex items-center space-x-2">
          <div 
            className={`
              w-2 h-2 rounded-full 
              transition-all duration-700 ease-in-out
              ${isLiveDotVisible 
                ? 'bg-green-500 opacity-100' 
                : 'bg-green-500 opacity-40'
              }
            `}
          />
          <span className={`text-sm ${currentLang === 'th' ? notoSansThai.className : ''}`}>
            {translations[currentLang].header.liveOn}
          </span>
        </div>
        <LanguageSelector currentLang={currentLang} onLanguageChange={setCurrentLang} />
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
          <div className="mb-4">
            <div className="flex flex-col space-y-4 py-2">
              {/* Avatar and Identity Info */}
              <div className="flex items-center space-x-6">
                {/* Avatar */}
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

                {/* Name and Address */}
                <div className="flex flex-col justify-center space-y-2">
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
                </div>
              </div>

              {/* Bio */}
              <p className={`text-base text-[#5788FA] ${currentLang === 'th' ? notoSansThai.className : ''}`}>
                {translations[currentLang].profile.bio}
              </p>
            </div>
          </div>
          <div className="mb-4 mr-2 bg-black border border-[#5788FA] rounded-sm">
            <div className="flex flex-col items-start p-4">
              <span className="text-2xl font-bold text-[#5788FA]">
                ${walletBalance.toFixed(2)}
              </span>
              <ul className="space-y-1 pt-4">
                <li className={currentLang === 'th' ? notoSansThai.className : ''}>
                  {translations[currentLang].profile.stats.earned}: ${animatedData.earned.toFixed(2)}
                </li>
                <li className={currentLang === 'th' ? notoSansThai.className : ''}>
                  {translations[currentLang].profile.stats.spent}: ${animatedData.spent.toFixed(2)}
                </li>
                <li className={currentLang === 'th' ? notoSansThai.className : ''}>
                  {translations[currentLang].profile.stats.nfts}: {animatedData.nftsOwned}
                </li>
                <li className={currentLang === 'th' ? notoSansThai.className : ''}>
                  {translations[currentLang].profile.stats.tokens}: {animatedData.tokensOwned}
                </li>
                <li className={currentLang === 'th' ? notoSansThai.className : ''}>
                  {translations[currentLang].profile.stats.transactions}: {animatedData.transactions}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Stream and Chat */}
        <div className="flex-grow flex flex-col w-full lg:w-2/3">
          <div className="flex-grow p-4 pb-40 overflow-y-auto">
            <p className={`text-zinc-600 ${currentLang === 'th' ? notoSansThai.className : ''}`}>
              {translations[currentLang].stream.realTime}
            </p>
            <div className="mt-4 space-y-2" role="log" aria-live="polite">
              {streamEntries.map((entry, index) => renderStreamEntry(entry, index))}
            </div>
            {isThinking && (
              <div className="flex items-center mt-4 text-[#5788FA] opacity-70">
                <span className={`font-mono ${currentLang === 'th' ? notoSansThai.className : ''}`}>
                  {translations[currentLang].stream.thinking}{loadingDots}
                </span>
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
                className={`w-full h-24 lg:h-36 bg-black text-[#5788FA] p-4 pr-10 placeholder-[#5788FA] placeholder-opacity-50 ${
                  currentLang === 'th' ? notoSansThai.className : ''
                }`}
                placeholder={translations[currentLang].chat.placeholder}
                rows={1}
              />
              <div className="px-2 absolute bottom-0.5 right-0 flex items-center justify-between w-full -translate-y-1/2">
                <div className="flex space-x-2 text-xs lg:text-sm ml-2 overflow-x-auto">
                  <button 
                    onClick={() => setUserInput(translations[currentLang].chat.suggestions.send)}
                    className={`text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm ${
                      currentLang === 'th' ? notoSansThai.className : ''
                    }`}
                  >
                    {translations[currentLang].chat.suggestions.send}
                  </button>
                  <button 
                    onClick={() => setUserInput(translations[currentLang].chat.suggestions.create)}
                    className={`text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm ${
                      currentLang === 'th' ? notoSansThai.className : ''
                    }`}
                  >
                    {translations[currentLang].chat.suggestions.create}
                  </button>
                  <button 
                    onClick={() => setUserInput(translations[currentLang].chat.suggestions.positions)}
                    className={`text-[#5788FA] whitespace-nowrap hover:text-[#3D7BFF] hover:bg-zinc-900 transition-colors border border-[#5788FA] px-2 py-1 rounded-sm ${
                      currentLang === 'th' ? notoSansThai.className : ''
                    }`}
                  >
                    {translations[currentLang].chat.suggestions.positions}
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