"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

// Button Component
// A reusable button component with styling and disabled state management.
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
// A component for displaying social media icons as links.
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

// Interface for defining the structure of a sound element.
interface SoundElement {
  id: string
  name: string
  category: "beats" | "effects" | "melodies" | "voices"
  color: string
  symbol: string
  audio: string // Path to the audio file
}

// Interface for defining the structure of a character, which can hold a sound.
interface Character {
  id: string
  assignedSound: SoundElement | null
  isActive: boolean // Indicates if the character has an active sound
  position: number
}

// Main IncrediboxClone component
export default function IncrediboxClone() {
  // State to hold the current demo selection (not actively used for functionality, but kept for context)
  const [selectedDemo, setSelectedDemo] = useState("demo1")

  // State for managing the characters and their assigned sounds
  const [characters, setCharacters] = useState<Character[]>([
    { id: "char1", assignedSound: null, isActive: false, position: 1 },
    { id: "char2", assignedSound: null, isActive: false, position: 2 },
    { id: "char3", assignedSound: null, isActive: false, position: 3 },
    { id: "char4", assignedSound: null, isActive: false, position: 4 },
    { id: "char5", assignedSound: null, isActive: false, position: 5 },
    { id: "char6", assignedSound: null, isActive: false, position: 6 },
    { id: "char7", assignedSound: null, isActive: false, position: 7 },
  ])

    // Estado para controlar qué imagen mostrar para cada personaje
  const [currentImage, setCurrentImage] = useState<Record<string, number>>({
    char1: 1,
    char2: 1,
    char3: 1,
    char4: 1,
    char5: 1,
    char6: 1,
    char7: 1
  })

    // Efecto para cambiar la imagen cuando se asigna o quita un sonido
  useEffect(() => {
    setCurrentImage(prev => {
      const updated = {...prev}
      characters.forEach(char => {
        if (char.assignedSound) {
          updated[char.id] = 2  // Cambiar a imagen 2 si hay sonido asignado
        } else {
          updated[char.id] = 1  // Volver a imagen 1 si no hay sonido
        }
      })
      return updated
    })
  }, [characters])

  // useRef to store Audio objects. A Map is used for easy access by character ID.
  const audioPlayers = useRef<Map<string, HTMLAudioElement>>(new Map())
  // useRef to store the ID of the global beat interval (either setTimeout or setInterval ID).
  const globalBeatIntervalId = useRef<NodeJS.Timeout | null>(null)
  // Constant defining the duration of each audio loop in milliseconds.
  const loopDuration = 5000 // All audios are exactly 5 seconds long

  // Data for all available sound elements, categorized.
  const soundElements: SoundElement[] = [
    // Beats
    { id: "b1", name: "Kick", category: "beats", color: "bg-orange-400", symbol: "B1", audio: "/loops/2_deux_a.ogg" },
    { id: "b2", name: "Snare", category: "beats", color: "bg-orange-400", symbol: "B2", audio: "/loops/3_kosh_a.ogg" },
    { id: "b3", name: "Hi-Hat", category: "beats", color: "bg-orange-400", symbol: "B3", audio: "/loops/4_shpok_a.ogg" },
    { id: "b4", name: "Clap", category: "beats", color: "bg-orange-400", symbol: "B4", audio: "/loops/5_tom_a.ogg" },
    { id: "b5", name: "Perc", category: "beats", color: "bg-orange-400", symbol: "B5", audio: "/loops/6_nouana_a.ogg" },

    // Effects
    { id: "e1", name: "Scratch", category: "effects", color: "bg-blue-400", symbol: "E1", audio: "/loops/7_scratch_a.ogg" },
    { id: "e2", name: "Vinyl", category: "effects", color: "bg-blue-400", symbol: "E2", audio: "/loops/8_trill_a.ogg" },
    { id: "e3", name: "Reverse", category: "effects", color: "bg-blue-400", symbol: "E3", audio: "/loops/9_bass_a.ogg" },
    { id: "e4", name: "Filter", category: "effects", color: "bg-blue-400", symbol: "E4", audio: "/loops/10_uh_a.ogg" },
    { id: "e5", name: "Echo", category: "effects", color: "bg-blue-400", symbol: "E5", audio: "/loops/11_nugu_a.ogg" },

    // Melodies
    { id: "m1", name: "Piano", category: "melodies", color: "bg-green-400", symbol: "M1", audio: "/loops/12_guit_a.ogg" },
    { id: "m2", name: "Guitar", category: "melodies", color: "bg-green-400", symbol: "M2", audio: "/loops/13_tromp_a.ogg" },
    { id: "m3", name: "Bass", category: "melodies", color: "bg-green-400", symbol: "M3", audio: "/loops/14_pouin_a.ogg" },
    { id: "m4", name: "Synth", category: "melodies", color: "bg-green-400", symbol: "M4", audio: "/loops/15_tung_a.ogg" },
    { id: "m5", name: "Lead", category: "melodies", color: "bg-green-400", symbol: "M5", audio: "/loops/16_aoun_a.ogg" },

    // Voices
    { id: "v1", name: "Vocal 1", category: "voices", color: "bg-purple-400", symbol: "V1", audio: "/loops/17_hum_a.ogg" },
    { id: "v2", name: "Vocal 2", category: "voices", color: "bg-purple-400", symbol: "V2", audio: "/loops/18_get_a.ogg" },
    { id: "v3", name: "Vocal 3", category: "voices", color: "bg-purple-400", symbol: "V3", audio: "/loops/19_tellme_a.ogg" },
    { id: "v4", name: "Vocal 4", category: "voices", color: "bg-purple-400", symbol: "V4", audio: "/loops/20_make_a.ogg" },
    { id: "v5", name: "Vocal 5", category: "voices", color: "bg-purple-400", symbol: "V5", audio: "/loops/1_lead_a.ogg" },
  ]

  // State for drag and drop visual feedback
  const [draggedElement, setDraggedElement] = useState<SoundElement | null>(null)
  const [dragOverCharacter, setDragOverCharacter] = useState<string | null>(null)

  /**
   * Manages the global audio synchronization beat.
   * This function ensures all active sounds start at the same time every `loopDuration` (5 seconds).
   * If no sounds are active, it clears the interval and pauses all audios.
   * This function is memoized with useCallback to prevent unnecessary re-renders.
   * @param currentActiveCharacters The array of characters reflecting the latest state, used to determine which sounds should be playing.
   */
  const startGlobalBeat = useCallback((currentActiveCharacters: Character[]) => {
    // Clear any previous interval to prevent multiple simultaneous loops
    if (globalBeatIntervalId.current) {
      clearInterval(globalBeatIntervalId.current)
      globalBeatIntervalId.current = null
    }

    // Function to play all active sounds at the start of a beat
    const playAllActiveSounds = () => {
      // Iterate through characters to play/sync their assigned sounds
      currentActiveCharacters.forEach(char => {
        if (char.assignedSound && char.isActive) {
          let audio = audioPlayers.current.get(char.id)
          // If audio element doesn't exist for this character, create it
          if (!audio) {
            audio = new Audio(char.assignedSound.audio)
            audioPlayers.current.set(char.id, audio)
          } else if (audio.src !== window.location.origin + char.assignedSound.audio) {
            // If the sound source changed for this character slot, update it
            audio.pause()
            audio.src = char.assignedSound.audio
            audio.load() // Load the new source
          }
          audio.currentTime = 0 // Ensure it starts from the beginning of the loop
          audio.loop = false // Looping is managed by the interval, not Audio element's loop property
          audio.play().catch(e => console.error(`Error playing audio for ${char.id}:`, e)) // Catch potential play errors
        } else {
          // If character is no longer active or sound removed, ensure its audio is paused
          const audio = audioPlayers.current.get(char.id)
          if (audio) {
            audio.pause()
            audio.currentTime = 0
          }
        }
      })
    }

    // Check if there are any characters with assigned and active sounds to play
    const hasActiveSounds = currentActiveCharacters.some(char => char.assignedSound !== null && char.isActive)

    if (hasActiveSounds) {
      const now = performance.now()
      // Calculate the time until the next 5-second boundary (e.g., 0s, 5s, 10s, ...)
      // This ensures that when a new sound is added, it waits for the current 5-second cycle
      // to complete, and then all sounds (new and old) start perfectly coordinated at the next beat.
      const timeToNextBeat = loopDuration - (now % loopDuration)

      // Set a timeout for the very first synchronized beat.
      // This initial timeout handles the waiting period for the current loop to end.
      globalBeatIntervalId.current = setTimeout(() => {
        playAllActiveSounds() // Play sounds for the first beat
        // After the first beat, set up the recurring interval for subsequent beats.
        globalBeatIntervalId.current = setInterval(playAllActiveSounds, loopDuration)
      }, timeToNextBeat)
    } else {
      // If no active sounds, ensure the global interval is cleared and all audios are paused.
      if (globalBeatIntervalId.current) {
        clearInterval(globalBeatIntervalId.current)
        globalBeatIntervalId.current = null
      }
      audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
      // Clear the map to release audio resources if no sounds are active
      audioPlayers.current.clear()
    }
  }, [loopDuration]) // loopDuration is a constant, so it's a stable dependency

  // Drag start handler: sets the dragged element and visual feedback.
  const handleDragStart = (e: React.DragEvent, element: SoundElement) => {
    setDraggedElement(element)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", element.id)
    const target = e.target as HTMLElement
    target.style.opacity = "0.5" // Apply visual feedback
  }

  // Drag end handler: resets visual feedback.
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1" // Reset visual feedback
    setDraggedElement(null)
    setDragOverCharacter(null)
  }

  // Drag over handler: prevents default to allow dropping and sets drag-over visual feedback.
  const handleDragOver = (e: React.DragEvent, characterId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDragOverCharacter(characterId)
  }

  // Drag leave handler: clears drag-over visual feedback.
  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverCharacter(null)
  }

  // Drop handler: assigns the dragged sound to the character and triggers global beat synchronization.
  const handleDrop = (e: React.DragEvent, characterId: string) => {
    e.preventDefault()
    setDragOverCharacter(null)

    if (draggedElement) {
      setCharacters((prev) => {
        const updatedCharacters = prev.map((char) =>
          char.id === characterId ? { ...char, assignedSound: draggedElement, isActive: true } : char,
        )
        // Trigger the global beat synchronization with the updated characters state.
        // This will handle playing the new sound in sync with others.
        startGlobalBeat(updatedCharacters)
        return updatedCharacters
      })
    }
  }

  // Handles clicking on a character to remove its assigned sound and stop playback.
  const handleCharacterClick = (characterId: string) => {
    setCharacters((prev) => {
      const updatedCharacters = prev.map((char) => {
        if (char.id === characterId) {
          // Pause and reset the specific audio being removed
          const audio = audioPlayers.current.get(characterId)
          if (audio) {
            audio.pause()
            audio.currentTime = 0
            audioPlayers.current.delete(characterId) // Remove the audio instance from the map
          }
          // Set assignedSound to null and isActive to false for this character slot
          return { ...char, assignedSound: null, isActive: false }
        }
        return char
      })
      // Re-evaluate and potentially re-sync the global beat with the updated set of active characters.
      // If no sounds are left, this will stop the global loop.
      startGlobalBeat(updatedCharacters)
      return updatedCharacters
    })
  }

  // Resets all characters by removing their assigned sounds and stops all audio playback.
  const handleReset = () => {
    setCharacters((prev) =>
      prev.map((char) => ({
        ...char,
        assignedSound: null,
        isActive: false,
      })),
    )
    // After resetting, ensure the global beat interval is stopped
    if (globalBeatIntervalId.current) {
      clearInterval(globalBeatIntervalId.current)
      globalBeatIntervalId.current = null
    }
    // Also pause and clear all audio players to free resources
    audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
    })
    audioPlayers.current.clear()
  }

  // Helper function to get Tailwind CSS gradient classes based on category for styling.
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

  // Effect hook to clean up audio resources and intervals when the component unmounts.
  useEffect(() => {
    // Return a cleanup function
    return () => {
      if (globalBeatIntervalId.current) {
        clearTimeout(globalBeatIntervalId.current) // Clear any pending setTimeout
        clearInterval(globalBeatIntervalId.current) // Clear recurring setInterval
      }
      // Pause and clear all Audio objects to release resources
      audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.src = '' // Release audio resource
        audio.load() // Ensure the audio element is reset
      })
      audioPlayers.current.clear() // Clear the map
    }
  }, []) // Empty dependency array means this runs once on mount and once on unmount

  return (
    <div className="min-h-screen bg-[#f5f1eb] font-sans">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black italic tracking-wide">NOTINCREDIBOX</h1>
            </div>

            {/* Navigation Links */}
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

            {/* Social Icons and Language Selector */}
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
                {/* Placeholder for language flag (French flag colors) */}
                <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 bg-blue-700"></div> {/* Blue part */}
                    <div className="w-1/3 bg-white"></div> {/* White part */}
                    <div className="w-1/3 bg-red-600"></div> {/* Red part */}
                  </div>
                </div>
                <span className="text-sm text-gray-600">🌐</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Demo Selection Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Choose Your Demo</h2>
        </div>

        {/* Incredibox-style Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Characters Row: where sounds are dropped */}
          <div className="flex justify-center items-end space-x-4 sm:space-x-6 mb-12 min-h-[320px]">
            {characters.map((character) => (
              <div
                key={character.id}
                className="flex flex-col items-center cursor-pointer group relative"
                onDragOver={(e) => handleDragOver(e, character.id)} // Handle drag over a character
                onDragLeave={handleDragLeave} // Handle drag leaving a character
                onDrop={(e) => handleDrop(e, character.id)} // Handle dropping a sound on a character
                onClick={() => handleCharacterClick(character.id)} // Handle clicking a character to remove sound
              >
                {/* Drop Zone Indicator: visual cue when dragging over a character */}
                {dragOverCharacter === character.id && (
                  <div className="absolute inset-0 bg-yellow-300 bg-opacity-30 rounded-full animate-pulse border-4 border-yellow-400 border-dashed"></div>
                )}

                {/* Character Representation */}
<div
  className={`mb-3 transition-all duration-300 
  ${character.assignedSound && character.isActive ? "animate-bounce" : ""} 
  ${!character.assignedSound ? "group-hover:scale-105" : ""}`}
>
            {character.id === "char1" && (
                    <div className="relative">
                      <Image
                        src={
                          currentImage[character.id] === 1 
                            ? "/characters/weirdlemon/weirdlemon1.PNG" 
                            : "/characters/weirdlemon/weirdlemon2.PNG"
                        }
                        alt="Weird Lemon"
                        width={180}
                        height={220}
                        style={{ 
                          objectFit: "contain", 
                          border: 'none', 
                          outline: 'none',
                          maxWidth: '100%',
                          height: 'auto',
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                        className="border-0 outline-none"
                        priority
                      />
                    </div>
                  )}
  
       {character.id === "char2" && (
                    <div className="relative">
                      <Image
                        src={
                          currentImage[character.id] === 1 
                            ? "/characters/toad/toad1.PNG" 
                            : "/characters/toad/toad2.PNG"
                        }
                        alt="Toad"
                        width={220}
                        height={300}
                        style={{ 
                          objectFit: "contain", 
                          border: 'none', 
                          outline: 'none',
                          maxWidth: '100%',
                          height: 'auto',
                          transition: 'opacity 0.5s ease-in-out'
                        }}
                        className="border-0 outline-none"
                        priority
                      />
                    </div>
                  )}

                  {/* Sound Indicator: displays the symbol of the assigned sound */}
                  {character.assignedSound && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
                      {character.assignedSound.symbol.slice(-1)}
                    </div>
                  )}

                  {/* Active Indicator: a pulsing circle when character is actively playing a sound */}
                  {character.isActive && character.assignedSound && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Character Base (visual element below the character) */}
                <div
                  className={`w-24 h-6 rounded-full transition-all duration-200 ${
                    character.assignedSound ? "bg-gray-600 shadow-md" : "bg-gray-400"
                  }`}
                ></div>

                {/* Character Label: displays the name of the assigned sound or slot number */}
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {character.assignedSound ? character.assignedSound.name : `Slot ${character.position}`}
                </div>
              </div>
            ))}
          </div>

          {/* Control Panel (updated to remove play/stop, only reset remains) */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <Button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🔄 RESET
            </Button>
          </div>

          {/* Sound Elements Section: draggable sound categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* Beats Category */}
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

            {/* Effects Category */}
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

            {/* Melodies Category */}
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

            {/* Voices Category */}
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

        {/* Instructions and Action Buttons */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg mb-4 font-medium">
              🎵 Drag and drop icons onto the characters to make them sing and start to compose your own music!
            </p>
            <div className="flex justify-center space-x-6 flex-wrap gap-4">
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

      {/* Footer Section */}
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
