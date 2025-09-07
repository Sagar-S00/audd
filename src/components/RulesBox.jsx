import { useState } from 'react'

const RulesBox = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const rules = [
    'No bullying of any kind will be tolerated, even the "jokingly" kind. Leaders or curators will be notified if it occurs.',
    'No slurs will be spoken, even some that were claimed because of circumstances. This leads into the topic of racism—this will not be tolerated, and you will be removed without hesitation.',
    'Don\'t be rude for no reason. We a...'
  ]

  return (
    <div className="mx-4 mb-4 rounded-lg bg-black/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg text-cafe-orange">→</span>
        <h3 className="font-bold text-yellow-400">燒賣 Welcome! What will it be today? ★ ★ ★ 『 Rules 』</h3>
      </div>
      
      <div className="text-sm text-white">
        <p className="mb-2">
          I. No bullying of any kind will be tolerated, even the "jokingly" kind. Leaders or curators will be notified if it occurs.
        </p>
        <p className="mb-2">
          II. No slurs will be spoken, even some that were claimed because of circumstances. This leads into the topic of racism—this will not be tolerated, and you will be removed without hesitation.
        </p>
        <p className="mb-2">
          III. Don't be rude for no reason. We a...
        </p>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          See All
        </button>
        
        {isExpanded && (
          <div className="mt-2 space-y-2">
            <p>IV. Respect all community members regardless of background.</p>
            <p>V. Keep conversations appropriate and family-friendly.</p>
            <p>VI. No spam or excessive self-promotion.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RulesBox