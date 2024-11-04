'use client'

interface TimeDisplayProps {
  currentTime: Date
}

export default function TimeDisplay({ currentTime }: TimeDisplayProps) {
  return (
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
  )
} 