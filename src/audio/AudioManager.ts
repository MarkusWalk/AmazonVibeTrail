import { Howl, Howler } from 'howler'

/**
 * AudioManager - Manages all game audio (music and sound effects)
 * Uses Howler.js for cross-browser audio support
 */
export class AudioManager {
  private music: Map<string, Howl> = new Map()
  private sfx: Map<string, Howl> = new Map()
  private currentMusic: Howl | null = null
  private currentMusicId: string | null = null
  private masterVolume: number = 0.8
  private musicVolume: number = 0.6
  private sfxVolume: number = 0.8
  private isMuted: boolean = false

  constructor() {
    // Set initial master volume
    Howler.volume(this.masterVolume)
  }

  /**
   * Initialize audio system with tracks
   */
  initialize(): void {
    console.log('[AudioManager] Initializing audio system')

    // For now, we'll use placeholder sounds
    // In a real game, you would load actual audio files

    // Music tracks (would be actual file paths)
    this.registerMusic('menu', {
      src: [], // Placeholder
      loop: true,
      volume: this.musicVolume,
    })

    this.registerMusic('river_calm', {
      src: [], // Placeholder
      loop: true,
      volume: this.musicVolume,
    })

    this.registerMusic('river_intense', {
      src: [], // Placeholder
      loop: true,
      volume: this.musicVolume,
    })

    // Sound effects (would be actual file paths)
    this.registerSFX('collision', {
      src: [], // Placeholder
      volume: this.sfxVolume,
    })

    this.registerSFX('collect', {
      src: [], // Placeholder
      volume: this.sfxVolume,
    })

    this.registerSFX('button_click', {
      src: [], // Placeholder
      volume: this.sfxVolume * 0.5,
    })

    console.log('[AudioManager] Audio system ready (placeholder mode)')
  }

  /**
   * Register a music track
   */
  private registerMusic(id: string, options: { src: string[], loop: boolean, volume: number }): void {
    if (options.src.length === 0) {
      // Skip registration if no source files
      return
    }

    const howl = new Howl({
      src: options.src,
      loop: options.loop,
      volume: options.volume,
      preload: true,
    })

    this.music.set(id, howl)
  }

  /**
   * Register a sound effect
   */
  private registerSFX(id: string, options: { src: string[], volume: number }): void {
    if (options.src.length === 0) {
      // Skip registration if no source files
      return
    }

    const howl = new Howl({
      src: options.src,
      volume: options.volume,
      preload: true,
    })

    this.sfx.set(id, howl)
  }

  /**
   * Play music track with crossfade
   */
  playMusic(trackId: string, fadeInDuration: number = 1000): void {
    if (this.isMuted) return

    const track = this.music.get(trackId)
    if (!track) {
      console.warn(`[AudioManager] Music track not found: ${trackId}`)
      return
    }

    // If same track is already playing, do nothing
    if (this.currentMusicId === trackId && this.currentMusic?.playing()) {
      return
    }

    // Fade out current music
    if (this.currentMusic && this.currentMusic.playing()) {
      this.currentMusic.fade(this.musicVolume, 0, fadeInDuration)
      const musicToStop = this.currentMusic
      setTimeout(() => {
        musicToStop.stop()
      }, fadeInDuration)
    }

    // Fade in new music
    track.volume(0)
    track.play()
    track.fade(0, this.musicVolume, fadeInDuration)

    this.currentMusic = track
    this.currentMusicId = trackId

    console.log(`[AudioManager] Playing music: ${trackId}`)
  }

  /**
   * Stop music with fade out
   */
  stopMusic(fadeOutDuration: number = 1000): void {
    if (this.currentMusic && this.currentMusic.playing()) {
      this.currentMusic.fade(this.musicVolume, 0, fadeOutDuration)
      const musicToStop = this.currentMusic
      setTimeout(() => {
        musicToStop.stop()
      }, fadeOutDuration)

      this.currentMusic = null
      this.currentMusicId = null
    }
  }

  /**
   * Play a sound effect
   */
  playSFX(sfxId: string, volume: number = 1.0): void {
    if (this.isMuted) return

    const sound = this.sfx.get(sfxId)
    if (!sound) {
      console.warn(`[AudioManager] SFX not found: ${sfxId}`)
      return
    }

    // Create a clone for overlapping sounds
    const howl = sound.play()
    sound.volume(this.sfxVolume * volume, howl)
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    Howler.volume(this.masterVolume)
    console.log(`[AudioManager] Master volume: ${this.masterVolume}`)
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.currentMusic) {
      this.currentMusic.volume(this.musicVolume)
    }
    console.log(`[AudioManager] Music volume: ${this.musicVolume}`)
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    console.log(`[AudioManager] SFX volume: ${this.sfxVolume}`)
  }

  /**
   * Mute all audio
   */
  mute(): void {
    this.isMuted = true
    Howler.mute(true)
    console.log('[AudioManager] Muted')
  }

  /**
   * Unmute all audio
   */
  unmute(): void {
    this.isMuted = false
    Howler.mute(false)
    console.log('[AudioManager] Unmuted')
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    if (this.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }
    return this.isMuted
  }

  /**
   * Get current mute state
   */
  isMutedState(): boolean {
    return this.isMuted
  }

  /**
   * Cleanup
   */
  destroy(): void {
    // Stop all music
    this.music.forEach((howl) => {
      howl.unload()
    })

    // Stop all SFX
    this.sfx.forEach((howl) => {
      howl.unload()
    })

    this.music.clear()
    this.sfx.clear()
    this.currentMusic = null
    this.currentMusicId = null

    console.log('[AudioManager] Destroyed')
  }
}

// Export singleton instance
export const audioManager = new AudioManager()
