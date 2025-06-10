"use client"

import type React from "react"

import { useState } from "react"

// Button Component
const Button = ({ children, className = "", onClick, disabled = false, ...props }: any) => {
  return (
    <button
      className={`px-4 py-2 rounded transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Social Icon Component
const SocialIcon = ({ icon, href }: { icon: string; href: string }) => {
  return (
    <a
      href={href}
      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}

interface SoundElement {
  id: string
  name: string
  category: "beats" | "effects" | "melodies" | "voices"
  color: string
  symbol: string
}

interface Character {
  id: string
  assignedSound: SoundElement | null
  isActive: boolean
  position: number
}

export default function IncrediboxClone() {
  const [selectedDemo, setSelectedDemo] = useState("demo1")
  const [isPlaying, setIsPlaying] = useState(false)
  const [draggedElement, setDraggedElement] = useState<SoundElement | null>(null)
  const [dragOverCharacter, setDragOverCharacter] = useState<string | null>(null)

  const [characters, setCharacters] = useState<Character[]>([
    { id: "char1", assignedSound: null, isActive: false, position: 1 },
    { id: "char2", assignedSound: null, isActive: false, position: 2 },
    { id: "char3", assignedSound: null, isActive: false, position: 3 },
    { id: "char4", assignedSound: null, isActive: false, position: 4 },
    { id: "char5", assignedSound: null, isActive: false, position: 5 },
    { id: "char6", assignedSound: null, isActive: false, position: 6 },
    { id: "char7", assignedSound: null, isActive: false, position: 7 },
  ])

  const soundElements: SoundElement[] = [
    // Beats
    { id: "b1", name: "Kick", category: "beats", color: "bg-orange-400", symbol: "B1" },
    { id: "b2", name: "Snare", category: "beats", color: "bg-orange-400", symbol: "B2" },
    { id: "b3", name: "Hi-Hat", category: "beats", color: "bg-orange-400", symbol: "B3" },
    { id: "b4", name: "Clap", category: "beats", color: "bg-orange-400", symbol: "B4" },
    { id: "b5", name: "Perc", category: "beats", color: "bg-orange-400", symbol: "B5" },

    // Effects
    { id: "e1", name: "Scratch", category: "effects", color: "bg-blue-400", symbol: "E1" },
    { id: "e2", name: "Vinyl", category: "effects", color: "bg-blue-400", symbol: "E2" },
    { id: "e3", name: "Reverse", category: "effects", color: "bg-blue-400", symbol: "E3" },
    { id: "e4", name: "Filter", category: "effects", color: "bg-blue-400", symbol: "E4" },
    { id: "e5", name: "Echo", category: "effects", color: "bg-blue-400", symbol: "E5" },

    // Melodies
    { id: "m1", name: "Piano", category: "melodies", color: "bg-green-400", symbol: "M1" },
    { id: "m2", name: "Guitar", category: "melodies", color: "bg-green-400", symbol: "M2" },
    { id: "m3", name: "Bass", category: "melodies", color: "bg-green-400", symbol: "M3" },
    { id: "m4", name: "Synth", category: "melodies", color: "bg-green-400", symbol: "M4" },
    { id: "m5", name: "Lead", category: "melodies", color: "bg-green-400", symbol: "M5" },

    // Voices
    { id: "v1", name: "Vocal 1", category: "voices", color: "bg-purple-400", symbol: "V1" },
    { id: "v2", name: "Vocal 2", category: "voices", color: "bg-purple-400", symbol: "V2" },
    { id: "v3", name: "Vocal 3", category: "voices", color: "bg-purple-400", symbol: "V3" },
    { id: "v4", name: "Vocal 4", category: "voices", color: "bg-purple-400", symbol: "V4" },
    { id: "v5", name: "Vocal 5", category: "voices", color: "bg-purple-400", symbol: "V5" },
  ]

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, element: SoundElement) => {
    setDraggedElement(element)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", element.id)

    // Add visual feedback to drag element
    const target = e.target as HTMLElement
    target.style.opacity = "0.5"
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedElement(null)
    setDragOverCharacter(null)
  }

  const handleDragOver = (e: React.DragEvent, characterId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDragOverCharacter(characterId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverCharacter(null)
  }

  const handleDrop = (e: React.DragEvent, characterId: string) => {
    e.preventDefault()
    setDragOverCharacter(null)

    if (draggedElement) {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === characterId ? { ...char, assignedSound: draggedElement, isActive: true } : char,
        ),
      )
    }
  }

  const handleCharacterClick = (characterId: string) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === characterId ? { ...char, assignedSound: null, isActive: false } : char)),
    )
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
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
      case "beats":
        return "from-orange-400 to-orange-600"
      case "effects":
        return "from-blue-400 to-blue-600"
      case "melodies":
        return "from-green-400 to-green-600"
      case "voices":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black italic tracking-wide">NOTINCREDIBOX</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">
                APP
              </a>
              <a href="#" className="text-black font-bold border-b-2 border-black pb-1">
                DEMO
              </a>
              <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">
                PLAYLIST
              </a>
              <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">
                ALBUMS
              </a>
              <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">
                SHOP
              </a>
            </nav>

            {/* Social Icons and Language */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3">
                <SocialIcon icon="f" href="#" />
                <SocialIcon icon="𝕏" href="#" />
                <SocialIcon icon="▶" href="#" />
                <SocialIcon icon="📷" href="#" />
                <SocialIcon icon="🎵" href="#" />
                <SocialIcon icon="t" href="#" />
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-red-500 relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 bg-red-500"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-red-500"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">🌐</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Selection */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Choose Your Demo</h2>
          {/* <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: "demo1", name: "Alpha", color: "bg-orange-400" },
              { id: "demo2", name: "Little Miss", color: "bg-pink-400" },
              { id: "demo3", name: "Sunrise", color: "bg-yellow-400" },
              { id: "demo4", name: "The Love", color: "bg-red-400" },
              { id: "demo5", name: "Brazil", color: "bg-green-400" },
              { id: "demo6", name: "Alive", color: "bg-blue-400" },
              { id: "demo7", name: "Jeevan", color: "bg-purple-400" },
              { id: "demo8", name: "Dystopia", color: "bg-gray-600" },
            ].map((demo) => (
              <Button
                key={demo.id}
                onClick={() => setSelectedDemo(demo.id)}
                className={`${demo.color} text-white font-bold px-6 py-3 rounded-full hover:opacity-80 transition-all duration-200 ${
                  selectedDemo === demo.id ? "ring-4 ring-black ring-opacity-30 scale-105" : ""
                }`}
              >
                {demo.name}
              </Button>
            ))}
          </div> */}
        </div>

        {/* Demo Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Characters Row */}
          <div className="flex justify-center items-end space-x-6 mb-12 min-h-[320px]">
            {characters.map((character) => (
              <div
                key={character.id}
                className="flex flex-col items-center cursor-pointer group relative"
                onDragOver={(e) => handleDragOver(e, character.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, character.id)}
                onClick={() => handleCharacterClick(character.id)}
              >
                {/* Drop Zone Indicator */}
                {dragOverCharacter === character.id && (
                  <div className="absolute inset-0 bg-yellow-300 bg-opacity-30 rounded-full animate-pulse border-4 border-yellow-400 border-dashed"></div>
                )}

                {/* Character */}
                <div
                  className={`w-20 h-32 rounded-full mb-3 relative overflow-hidden transition-all duration-300 ${
                    character.assignedSound
                      ? `bg-gradient-to-b ${getCategoryColor(character.assignedSound.category)} shadow-lg ${
                          isPlaying && character.isActive ? "animate-bounce" : ""
                        }`
                      : "bg-gradient-to-b from-gray-300 to-gray-500 group-hover:scale-105"
                  }`}
                >
                  {/* Character Face */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gray-700 rounded"></div>

                  {/* Character Body */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-700 rounded"></div>

                  {/* Sound Indicator */}
                  {character.assignedSound && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
                      {character.assignedSound.symbol.slice(-1)}
                    </div>
                  )}

                  {/* Active Indicator */}
                  {character.isActive && isPlaying && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Character Base */}
                <div
                  className={`w-24 h-6 rounded-full transition-all duration-200 ${
                    character.assignedSound ? "bg-gray-600 shadow-md" : "bg-gray-400"
                  }`}
                ></div>

                {/* Character Label */}
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {character.assignedSound ? character.assignedSound.name : `Slot ${character.position}`}
                </div>
              </div>
            ))}
          </div>

          {/* Control Panel */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <Button
              onClick={handlePlay}
              className={`${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </Button>
            <Button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              ⏹ STOP
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🔄 RESET
            </Button>
          </div>

          {/* Sound Elements */}
          <div className="grid grid-cols-4 gap-6">
            {/* Beats */}
            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-700 mb-6 text-lg">BEATS</h3>
              {soundElements
                .filter((el) => el.category === "beats")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-full h-14 ${element.color} hover:bg-orange-500 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    {element.symbol}
                  </div>
                ))}
            </div>

            {/* Effects */}
            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-700 mb-6 text-lg">EFFECTS</h3>
              {soundElements
                .filter((el) => el.category === "effects")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-full h-14 ${element.color} hover:bg-blue-500 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    {element.symbol}
                  </div>
                ))}
            </div>

            {/* Melodies */}
            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-700 mb-6 text-lg">MELODIES</h3>
              {soundElements
                .filter((el) => el.category === "melodies")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-full h-14 ${element.color} hover:bg-green-500 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    {element.symbol}
                  </div>
                ))}
            </div>

            {/* Voices */}
            <div className="space-y-3">
              <h3 className="text-center font-bold text-gray-700 mb-6 text-lg">VOICES</h3>
              {soundElements
                .filter((el) => el.category === "voices")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-full h-14 ${element.color} hover:bg-purple-500 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    {element.symbol}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg mb-4 font-medium">
              🎵 Drag and drop icons onto the characters to make them sing and start to compose your own music!
            </p>
            <div className="flex justify-center space-x-6">
              <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 font-bold">
                📹 RECORD
              </Button>
              <Button className="bg-gray-300 text-black px-8 py-3 rounded-full hover:bg-gray-400 font-bold">
                📤 SHARE
              </Button>
              <Button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 font-bold">
                💾 SAVE
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Incredibox Clone. Made with ❤️ for music lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
