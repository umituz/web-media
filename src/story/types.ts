export type StoryBubbleType = 'dialogue' | 'thought' | 'narration' | 'shout'

export type StoryGloss = 'primary' | 'secondary' | 'both'

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
  text: string
  meaning?: string
  secondaryMeaning?: string
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
  text: string
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
}

export interface StoryQuizQuestion {
  id: string
  prompt: string
  promptText?: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface StoryEpisode {
  id: string
  storyId: string
  episodeNumber: number
  title: string
  nativeTitle: string
  summary: string
  coverUrl?: string
  scenes: StoryScene[]
  quiz?: StoryQuizQuestion[]
  levelId?: string
}

export interface StoryBook {
  id: string
  title: string
  nativeTitle: string
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
