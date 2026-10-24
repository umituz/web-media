export type BubbleType = 'dialogue' | 'thought' | 'narration' | 'shout'

export interface ComicWord {
  word: string
  meaning: string
  romanization?: string
  hanja?: string
}

export interface ComicBubble {
  id: string
  type: BubbleType
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
  vocabulary?: ComicWord[]
}

export type SfxVariant = 'impact' | 'emotion' | 'motion' | 'ambient'

export interface ComicSfx {
  id: string
  korean: string
  romanization: string
  meaning: string
  variant?: SfxVariant
  x?: number
  y?: number
}

export interface ComicPanel {
  id: string
  order: number
  imageUrl?: string
  altText?: string
  narration?: string
  bubbles: ComicBubble[]
  sfx?: ComicSfx[]
  backgroundSvg?: string
}

export interface ComicQuizQuestion {
  id: string
  prompt: string
  koreanPrompt?: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface ComicEpisode {
  id: string
  storyId: string
  episodeNumber: number
  title: string
  koreanTitle: string
  summary: string
  coverUrl?: string
  panels: ComicPanel[]
  quiz?: ComicQuizQuestion[]
  levelId?: string
}

export interface ComicStory {
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

export type ComicViewMode = 'page' | 'strip'
