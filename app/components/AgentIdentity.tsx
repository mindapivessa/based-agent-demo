'use client'

import { useRef } from 'react'
import { Noto_Sans_Thai } from 'next/font/google'
import { translations } from '@/app/translations'

const notoSansThai = Noto_Sans_Thai({
  weight: ['400', '700'],
  subsets: ['thai'],
})

type Props = {
  agentName: string
  agentWallet: string
  eyePosition: { x: number; y: number }
  currentLang: string
  showToast: boolean
  onCopyWallet: () => void
}

export default function AgentIdentity({ 
  agentName, 
  agentWallet, 
  eyePosition, 
  currentLang,
  showToast,
  onCopyWallet 
}: Props) {
  const avatarRef = useRef<SVGSVGElement>(null)

  return (
    <div className="flex flex-col space-y-4 py-2">
      <div className="flex items-center space-x-5">
        <svg
          ref={avatarRef}
          width="70"
          height="70"
          viewBox="0 0 100 100"
          className="bg-[#5788FA]"
          role="img"
          aria-label="Animated avatar"
        >
          <circle cx="50" cy="50" r="45" fill="#000000" />
          <circle cx={eyePosition.x} cy={eyePosition.y} r="5" fill="#5788FA" />
        </svg>

        <div className="flex flex-col justify-center space-y-2">
          <h2 className="text-xl font-bold text-[#5788FA]">{agentName}</h2>
          <div className="relative inline-flex items-center group">
            <button 
              onClick={onCopyWallet}
              className="text-sm text-[#5788FA] hover:text-[#3D7BFF] transition-colors"
            >
              {agentWallet}
            </button>
            {showToast && (
              <div className="absolute top-full left-0 mt-2 bg-[#5788FA] text-zinc-950 text-xs px-2 py-1 rounded-xs">
                Copied
              </div>
            )}
          </div>
        </div>
      </div>
      <p className={`text-base text-[#5788FA] ${currentLang === 'th' ? notoSansThai.className : ''}`}>
        {translations[currentLang].profile.bio}
      </p>
    </div>
  )
}