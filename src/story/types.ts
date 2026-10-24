export type StoryBubbleType = 'dialogue' | 'thought' | 'narration' | 'shout'

export interface StoryWord {
  word: string
  meaning: string
  romanization?: string
  hanja?: string
}

export interface StoryBubble {
  id: string
  type: StoryBubbleType
  speaker?: string
  avatarUrl?: string
  korean: string
  english?: string
  turkish?: string
  romanization?: string
  audioUrl?: string
  x?: number
  y?: number
  tailPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'none'
  vocabulary?: StoryWord[]
}

export type StoryEffectVariant = 'impact' | 'emotion' | 'motion' | 'ambient'

export interface StoryEffect {
  id: string
  korean: string
  romanization: string
  meaning: string
  variant?: StoryEffectVariant
  x?: number
  y?: number
}

export interface StoryScene {
  id: string
  order: number
  imageUrl?: string
  altText?: string
  narration?: string
  bubbles: StoryBubble[]
  effects?: StoryEffect[]
  backgroundSvg?: string
  /** @deprecated use effects instead */
  sfx?: StoryEffect[]
}

export interface StoryQuizQuestion {
  id: string
  prompt: string
  koreanPrompt?: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface StoryEpisode {
  id: string
  storyId: string
  episodeNumber: number
  title: string
  koreanTitle: string
  summary: string
  coverUrl?: string
  scenes: StoryScene[]
  /** @deprecated alias for scenes */
  panels?: StoryScene[]
  quiz?: StoryQuizQuestion[]
  levelId?: string
}

export interface StoryBook {
  id: string
  title: string
  koreanTitle: string
  description: string
  coverUrl: string
  category: string
  levelId: string
  author?: string
  artist?: string
  badge?: string
  episodesCount: number
  tags: string[]
}

export type StoryViewMode = 'page' | 'strip'

// Backward compatibility aliases
export type BubbleType = StoryBubbleType
export type ComicWord = StoryWord
export type ComicBubble = StoryBubble
export type SfxVariant = StoryEffectVariant
export type ComicSfx = StoryEffect
export type ComicPanel = StoryScene
export type ComicQuizQuestion = StoryQuizQuestion
export type ComicEpisode = StoryEpisode
export type ComicStory = StoryBook
export type ComicViewMode = StoryViewMode
