// Safety check utility for detecting concerning user input
// This helps identify when users might be expressing distress or self-harm thoughts

const CONCERNING_KEYWORDS = [
  // Direct self-harm references (multi-word phrases first, then single words)
  'kill myself', 'end my life', 'end it all', 'end everything',
  'want to die', 'not want to live',
  'hurt myself', 'self harm', 'cut myself', 'harm myself',
  'hang myself', 'hanging myself',
  'hurt someone', 'harm someone',
  'no reason to live', 'better off dead', 'can\'t go on', 'can\'t do this anymore',
  'medication abuse', 'substance abuse',
  
  // Single words (will use word boundaries to avoid false positives)
  'suicide', 'suicidal', 'die', 'death', 'dying', 'dead',
  'hang', 'kill', 'killing', 'murder', 'murdering',
  'violence', 'violent', 'attack', 'assault',
  'drugs', 'drug', 'overdose', 'overdosing',
  // Note: 'od' removed - causes false positives (matches "code", "node", "mode", etc.)
  'smoking', 'smoke', 'cigarette', 'cigarettes', 'nicotine',
  'alcohol', 'drinking', 'drunk', 'alcoholic',
  'addiction', 'addicted', 'relapse', 'using',
  'pills',
  'no point', 'worthless', 'hopeless',
  'nothing matters', 'give up',
  'too much', 'overwhelmed', 'drowning', 'suffocating',
  'goodbye', 'final', 'last time', 'never see', 'won\'t be here',
];

const CONCERNING_PATTERNS = [
  /i (want|wish|hope) (i was|to be) (dead|gone|not here)/i,
  /(i|i\'m) (going to|gonna) (kill|hurt|end|murder|hang) (myself|my life|someone|anyone)/i,
  /(life|everything) (is|has) (no|not) (point|meaning|purpose)/i,
  /(i|i\'m) (worthless|useless|hopeless|broken)/i,
  /(can\'t|cannot) (do this|go on|handle|take) (anymore|any more)/i,
  /(want|going|gonna) (to|to) (kill|murder|hurt|harm|hang) (myself|someone|anyone|people)/i,
  /(hang|hanging) (myself|my life)/i,
  /(using|abusing|taking) (drugs|drug|pills|substances)/i,
  /(overdose|overdosing)/i,
  /(addicted|addiction) (to|with)/i,
  /\bod\b.*(overdose|drug)/i, // Only match "od" if it's clearly related to overdose/drugs
];

/**
 * Checks if user input contains concerning content related to self-harm, suicidal ideation, violence, or substance use
 * @param {string} text - The user input text to check
 * @returns {boolean} - True if concerning content is detected
 */
export const detectConcerningContent = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const lowerText = text.toLowerCase().trim();

  // Check for direct keyword matches with word boundaries to avoid false positives
  // For multi-word phrases, use includes. For single words, use word boundaries.
  for (const keyword of CONCERNING_KEYWORDS) {
    const keywordLower = keyword.toLowerCase();
    
    // If keyword is a single word, use word boundary regex to avoid substring matches
    if (keyword.split(' ').length === 1) {
      // Use word boundary to match whole words only (prevents "coding" matching "die")
      const wordBoundaryRegex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundaryRegex.test(lowerText)) {
        return true;
      }
    } else {
      // For multi-word phrases, use includes (e.g., "kill myself", "end my life")
      if (lowerText.includes(keywordLower)) {
        return true;
      }
    }
  }

  // Check for pattern matches
  for (const pattern of CONCERNING_PATTERNS) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets supportive resources and help information (Malaysian resources)
 * @returns {object} - Object containing help resources
 */
export const getSupportResources = () => {
  return {
    befrienders: {
      name: 'Befrienders Malaysia',
      number: '03-7627 2929',
      email: 'sam@befrienders.org.my',
      website: 'https://www.befrienders.org.my',
      available: '24/7',
      description: 'Free and confidential emotional support',
    },
    befriendersKuching: {
      name: 'Befrienders Kuching',
      number: '082-242800',
      website: 'https://befrienderskch.org.my',
      available: '6:30 PM - 9:30 PM daily',
      description: 'Available in Kuching area',
    },
    message: 'You are not alone. There are people who want to help and support you.',
  };
};

