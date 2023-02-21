import { PauseCircle, PlayCircle } from 'phosphor-react'
import React, { useState, useEffect } from 'react'

interface AudioPlayerProps {
  source: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ source }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(Math.floor(audioRef.current!.duration * 1000))
      })
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(Math.floor(audioRef.current!.currentTime * 1000))
      })
    }
  }, [])

  const togglePlay = () => {
    if (duration <= 0) return
    setIsPlaying(!isPlaying)
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play()
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(event.target.value)

    setCurrentTime(time / 1000)
    if (audioRef.current) {
      audioRef.current.currentTime = time / 1000
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }

  function handleEnded() {
    if (audioRef.current) {
      setCurrentTime(0)
      audioRef.current.currentTime = 0
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (time: number) => {
    const newTime = Math.round(time)
    const minutes = Math.floor(newTime / 60)
    const seconds = newTime - minutes * 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="flex items-center justify-center gap-4 rounded-full rounded-tr-none bg-gradient-to-l from-chattou-primaryDark to-chattou-primary px-4 text-chattou-text ">
      <audio ref={audioRef} src={source} onEnded={handleEnded} />
      <button className="rounded-full py-2" onClick={togglePlay}>
        {isPlaying ? (
          <PauseCircle size="32" weight="fill" />
        ) : (
          <PlayCircle size="32" weight="fill" />
        )}
      </button>
      <input
        type="range"
        min={0}
        step={1}
        max={duration}
        value={currentTime}
        onChange={handleTimeChange}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-chattou-secondary"
      />
      <div className="text-xs">
        {isPlaying ? (
          <span>{formatTime(currentTime / 1000)}</span>
        ) : (
          <span>{formatTime(duration / 1000)}</span>
        )}
      </div>
    </div>
  )
}

export default AudioPlayer
