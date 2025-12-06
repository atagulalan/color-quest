import { Howl } from 'howler'

let tickSound: Howl | null = null
let musicSound: Howl | null = null
let audioContext: AudioContext | null = null

// Initialize AudioContext lazily and reuse it
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
  }
  // Resume context if it's suspended (required by browser autoplay policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch((e) => {
      console.warn('Failed to resume audio context:', e)
    })
  }
  return audioContext
}

export function initializeAudio() {
  // Initialize tick sound (we'll create a simple beep if file doesn't exist)
  // In production, you'd load an actual sound file
  try {
    tickSound = new Howl({
      src: ['/assets/sounds/tick.mp3'],
      volume: 0.5,
      preload: true
    })
  } catch (e) {
    // Fallback: create a simple beep using Web Audio API
    console.warn('Could not load tick sound file, using fallback')
  }

  // Initialize background music
  try {
    musicSound = new Howl({
      src: ['/assets/sounds/music.mp3'],
      volume: 0.4,
      loop: true,
      preload: true
    })
  } catch (e) {
    console.warn('Could not load background music file')
  }
}

export function playTickSound(enabled: boolean) {
  if (!enabled || !tickSound) return
  try {
    tickSound.play()
  } catch (e) {
    // Fallback: use Web Audio API for beep
    playBeep()
  }
}

export function playBeep() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + 0.1
    )

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  } catch (e) {
    console.warn('Audio not supported:', e)
  }
}

export function playWinSound(enabled: boolean) {
  if (!enabled) return
  playBeepSequence([800, 1000, 1200], 150)
}

export function playLoseSound(enabled: boolean) {
  if (!enabled) return
  playBeepSequence([400, 300], 200)
}

function playBeepSequence(frequencies: number[], duration: number) {
  try {
    const ctx = getAudioContext()
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + duration / 1000
        )

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration / 1000)
      }, index * duration)
    })
  } catch (e) {
    console.warn('Audio not supported:', e)
  }
}

export function playBackgroundMusic(enabled: boolean) {
  if (!musicSound) return

  if (enabled) {
    if (!musicSound.playing()) {
      musicSound.play()
    }
  } else {
    musicSound.pause()
  }
}

export function stopBackgroundMusic() {
  if (musicSound && musicSound.playing()) {
    musicSound.pause()
    musicSound.seek(0) // Reset to beginning
  }
}

export function setMusicVolume(volume: number) {
  if (musicSound) {
    musicSound.volume(Math.max(0, Math.min(1, volume)))
  }
}

// Cleanup function to properly dispose of audio resources
export function cleanupAudio() {
  if (tickSound) {
    tickSound.unload()
    tickSound = null
  }
  if (musicSound) {
    musicSound.unload()
    musicSound = null
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch((e) => {
      console.warn('Failed to close audio context:', e)
    })
    audioContext = null
  }
}
