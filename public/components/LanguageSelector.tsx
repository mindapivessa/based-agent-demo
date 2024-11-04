type Language = 'en' | 'th' | 'zh'

interface LanguageSelectorProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export default function LanguageSelector({ currentLang, onLanguageChange }: LanguageSelectorProps) {
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'th', label: 'TH' },
    { code: 'zh', label: 'CN' }
  ] as const

  return (
    <div className="inline-flex border border-[#5788FA] rounded-sm overflow-hidden">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onLanguageChange(code)}
          style={{ width: '44px' }}
          className={`
            py-1 text-sm font-medium text-center
            ${currentLang === code 
              ? 'bg-[#5788FA] text-black' 
              : 'hover:bg-[#5788FA]/10'
            }
            ${code !== 'en' && 'border-l border-[#5788FA]'}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
} 