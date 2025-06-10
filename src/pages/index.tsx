import React, { useState } from "react"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"

interface SoundElement {
  id: string
  name: string
  category: "beat" | "melody" | "effect" | "vocal"
  color: string
  icon: string
}

interface Character {
  id: string
  name: string
  category: "beat" | "melody" | "effect" | "vocal"
  assignedSound: SoundElement | null
  isActive: boolean
}

const soundElements: SoundElement[] = [
  { id: "beat1", name: "Kick Drum", category: "beat", color: "bg-red-500", icon: "🥁" },
  { id: "beat2", name: "Snare", category: "beat", color: "bg-red-600", icon: "🎵" },
  { id: "beat3", name: "Hi-Hat", category: "beat", color: "bg-red-400", icon: "🎶" },

  { id: "melody1", name: "Piano", category: "melody", color: "bg-blue-500", icon: "🎹" },
  { id: "melody2", name: "Guitar", category: "melody", color: "bg-blue-600", icon: "🎸" },
  { id: "melody3", name: "Synth", category: "melody", color: "bg-blue-400", icon: "🎛️" },

  { id: "effect1", name: "Reverb", category: "effect", color: "bg-green-500", icon: "✨" },
  { id: "effect2", name: "Echo", category: "effect", color: "bg-green-600", icon: "🌊" },
  { id: "effect3", name: "Filter", category: "effect", color: "bg-green-400", icon: "🎚️" },

  { id: "vocal1", name: "Harmony", category: "vocal", color: "bg-purple-500", icon: "🎤" },
  { id: "vocal2", name: "Bass Voice", category: "vocal", color: "bg-purple-600", icon: "🗣️" },
  { id: "vocal3", name: "Whistle", category: "vocal", color: "bg-purple-400", icon: "🎵" },
]

export default function MusicCreator() {
  const [characters, setCharacters] = useState<Character[]>([
    { id: "char1", name: "Beat Master", category: "beat", assignedSound: null, isActive: false },
    { id: "char2", name: "Melody Maker", category: "melody", assignedSound: null, isActive: false },
    { id: "char3", name: "Effect Expert", category: "effect", assignedSound: null, isActive: false },
    { id: "char4", name: "Vocal Virtuoso", category: "vocal", assignedSound: null, isActive: false },
    { id: "char5", name: "Beat Builder", category: "beat", assignedSound: null, isActive: false },
    { id: "char6", name: "Sound Sculptor", category: "melody", assignedSound: null, isActive: false },
  ])

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [draggedElement, setDraggedElement] = useState<SoundElement | null>(null)

  const handleDragStart = (element: SoundElement) => {
    setDraggedElement(element)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, characterId: string) => {
    e.preventDefault()
    if (draggedElement) {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === characterId ? { ...char, assignedSound: draggedElement, isActive: true } : char,
        ),
      )
      setDraggedElement(null)
    }
  }

  const removeSound = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === characterId ? { ...char, assignedSound: null, isActive: false } : char)),
    )
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetAll = () => {
    setCharacters((prev) =>
      prev.map((char) => ({
        ...char,
        assignedSound: null,
        isActive: false,
      })),
    )
    setIsPlaying(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "beat":
        return "from-red-400 to-red-600"
      case "melody":
        return "from-blue-400 to-blue-600"
      case "effect":
        return "from-green-400 to-green-600"
      case "vocal":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            BeatBox Studio
          </h1>
          <p className="text-xl text-white/80">Create amazing music by mixing sounds and beats</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <button
            onClick={togglePlay}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={resetAll}
            className="border border-white/30 text-white hover:bg-white/10 px-6 py-4 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <div className="flex items-center gap-3 text-white">
            <Volume2 className="w-5 h-5" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm min-w-[3ch]">{volume}</span>
          </div>
        </div>

        {/* Characters Stage */}
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Music Characters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  character.isActive && isPlaying ? "animate-bounce" : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, character.id)}
                onClick={() => character.assignedSound && removeSound(character.id)}
              >
                <div
                  className={`p-6 h-40 flex flex-col items-center justify-center bg-gradient-to-br ${
                    character.assignedSound
                      ? getCategoryColor(character.assignedSound.category)
                      : "from-gray-600 to-gray-800"
                  } rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                    character.isActive && isPlaying ? "ring-4 ring-yellow-400 ring-opacity-75" : ""
                  }`}
                >
                  <div className="text-4xl mb-2">{character.assignedSound ? character.assignedSound.icon : "👤"}</div>
                  <div className="text-white text-center">
                    <div className="font-semibold text-sm">{character.name}</div>
                    {character.assignedSound && (
                      <div className="text-xs opacity-80 mt-1">{character.assignedSound.name}</div>
                    )}
                  </div>
                  {character.assignedSound && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                {!character.assignedSound && (
                  <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white/60 text-sm">Drop sound here</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sound Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["beat", "melody", "effect", "vocal"].map((category) => (
            <div key={category} className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 capitalize flex items-center gap-2">
                {category === "beat" && "🥁"}
                {category === "melody" && "🎹"}
                {category === "effect" && "✨"}
                {category === "vocal" && "🎤"}
                {category}s
              </h3>
              <div className="space-y-3">
                {soundElements
                  .filter((element) => element.category === category)
                  .map((element) => (
                    <div
                      key={element.id}
                      draggable
                      onDragStart={() => handleDragStart(element)}
                      className={`${element.color} p-4 rounded-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform duration-200 shadow-lg`}
                    >
                      <div className="flex items-center gap-3 text-white">
                        <span className="text-2xl">{element.icon}</span>
                        <span className="font-medium">{element.name}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-3">How to Play</h3>
            <div className="text-white/80 space-y-2 text-sm">
              <p>🎵 Drag sound elements from the bottom panels onto the characters</p>
              <p>▶️ Click Play to start your musical creation</p>
              <p>🗑️ Click on active characters to remove their sounds</p>
              <p>🔄 Use Reset to clear all sounds and start over</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            box-shadow: 0 0 2px 0px #555;
          }
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </div>
    </div>
  )
}