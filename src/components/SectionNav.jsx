import { ChevronDown, ChevronUp } from 'lucide-react'

export default function SectionNav({ sections, index, onSelect }) {
  function scrollTo(i) {
    const id = sections[i]?.id
    if (!id) return
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-3 z-40 hidden md:block">
      <button
        onClick={() => scrollTo(Math.max(0, index - 1))}
        className="p-2 bg-white/80 hover:bg-white rounded-2xl shadow border"
        aria-label="Previous section"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <div className="bg-white/70 rounded-2xl p-2 shadow border">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onSelect(i)}
            className={`block px-2 py-1 rounded-xl text-sm w-full text-left ${
              i === index
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'hover:bg-gray-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => scrollTo(Math.min(sections.length - 1, index + 1))}
        className="p-2 bg-white/80 hover:bg-white rounded-2xl shadow border"
        aria-label="Next section"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  )
}
