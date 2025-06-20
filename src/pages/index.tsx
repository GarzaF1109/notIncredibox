"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

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
  
 // useRef to store Audio objects. A Map is used for easy access by character ID.
  const [playingStatus, setPlayingStatus] = useState<Record<string, boolean>>({})
 // useRef to store the ID of the global beat interval (either setTimeout or setInterval ID).
  const audioPlayers = useRef<Map<string, HTMLAudioElement>>(new Map())
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

  // Efecto para cambiar la imagen cuando se asigna o quita un sonido
  useEffect(() => {
    setCurrentImage(prev => {
      const updated = {...prev}
      characters.forEach(char => {
        // Solo cambiar a la imagen 2 si el sonido está realmente reproduciéndose
        updated[char.id] = playingStatus[char.id] ? 2 : 1
      })
      return updated
    })
  }, [characters, playingStatus])

  const startGlobalBeat = useCallback((currentActiveCharacters: Character[]) => {
    if (globalBeatIntervalId.current) {
      clearInterval(globalBeatIntervalId.current)
      globalBeatIntervalId.current = null
    }

    const playAllActiveSounds = () => {
      // Mantener el estado de reproducción entre loops
      const newPlayingStatus: Record<string, boolean> = {...playingStatus};
      
      currentActiveCharacters.forEach(char => {
        if (char.assignedSound && char.isActive) {
          let audio = audioPlayers.current.get(char.id)
          if (!audio) {
            audio = new Audio(char.assignedSound.audio)
            audioPlayers.current.set(char.id, audio)
          } else if (audio.src !== window.location.origin + char.assignedSound.audio) {
            audio.pause()
            audio.src = char.assignedSound.audio
            audio.load()
          }
          
          // Escuchar el evento 'play' que se dispara cuando el audio realmente comienza
          const onPlay = () => {
            setPlayingStatus(prev => ({ ...prev, [char.id]: true }))
            audio?.removeEventListener('play', onPlay)
          }
          audio.addEventListener('play', onPlay)
          
          audio.currentTime = 0
          audio.loop = false
          audio.play().catch(e => console.error(`Error playing audio for ${char.id}:`, e))
          
          // Mantener boca abierta durante la reproducción
          newPlayingStatus[char.id] = true;
        }
      })
      
      // Actualizar estado de reproducción
      setPlayingStatus(newPlayingStatus);
    }

    const hasActiveSounds = currentActiveCharacters.some(char => char.assignedSound !== null && char.isActive)

    if (hasActiveSounds) {
      const now = performance.now()
      const timeToNextBeat = loopDuration - (now % loopDuration)

      globalBeatIntervalId.current = setTimeout(() => {
        playAllActiveSounds()
        globalBeatIntervalId.current = setInterval(playAllActiveSounds, loopDuration)
      }, timeToNextBeat)
    } else {
      if (globalBeatIntervalId.current) {
        clearInterval(globalBeatIntervalId.current)
        globalBeatIntervalId.current = null
      }
      audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
      audioPlayers.current.clear()
      
      // Cerrar todas las bocas cuando no hay sonidos activos
      const resetStatus: Record<string, boolean> = {};
      characters.forEach(char => {
        resetStatus[char.id] = false;
      });
      setPlayingStatus(resetStatus);
    }
  }, [loopDuration, playingStatus])

  const handleDragStart = (e: React.DragEvent, element: SoundElement) => {
    setDraggedElement(element)
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("text/plain", element.id)
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
      setCharacters((prev) => {
        const updatedCharacters = prev.map((char) =>
          char.id === characterId ? { ...char, assignedSound: draggedElement, isActive: true } : char,
        )
        startGlobalBeat(updatedCharacters)
        return updatedCharacters
      })
    }
  }

  const handleCharacterClick = (characterId: string) => {
    setCharacters((prev) => {
      const updatedCharacters = prev.map((char) => {
        if (char.id === characterId) {
          const audio = audioPlayers.current.get(characterId)
          if (audio) {
            audio.pause()
            audio.currentTime = 0
            audioPlayers.current.delete(characterId)
          }
          
          // Actualizar estado de reproducción
          setPlayingStatus(prev => ({ ...prev, [characterId]: false }))
          
          return { ...char, assignedSound: null, isActive: false }
        }
        return char
      })
      startGlobalBeat(updatedCharacters)
      return updatedCharacters
    })
  }

  const handleReset = () => {
    setCharacters((prev) =>
      prev.map((char) => ({
        ...char,
        assignedSound: null,
        isActive: false,
      })),
    )
    
    // Resetear todos los estados de reproducción
    const resetStatus: Record<string, boolean> = {}
    characters.forEach(char => {
      resetStatus[char.id] = false
    })
    setPlayingStatus(resetStatus)
    
    if (globalBeatIntervalId.current) {
      clearInterval(globalBeatIntervalId.current)
      globalBeatIntervalId.current = null
    }
    audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
    })
    audioPlayers.current.clear()
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

  useEffect(() => {
    return () => {
      if (globalBeatIntervalId.current) {
        clearTimeout(globalBeatIntervalId.current)
        clearInterval(globalBeatIntervalId.current)
      }
      audioPlayers.current.forEach(audio => {
        audio.pause()
        audio.src = ''
        audio.load()
      })
      audioPlayers.current.clear()
    }
  }, [])

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
                <div className="w-6 h-4 bg-red-500 relative rounded-sm overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 bg-blue-700"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-red-600"></div>
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
        {/* Fondo con personajes */}
        <div
          className="relative w-full flex justify-center items-end overflow-hidden mb-8"
          style={{
            height: '75vh',
            minHeight: 320,
            maxHeight: '80vh',
          }}
        >
          <Image
            src="/background/background.svg"
            alt="Fondo bosque pixel art"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 0,
            }}
            className="select-none pointer-events-none"
            priority
          />
          {/* Characters Row sobre el fondo */}
   <div className="flex justify-center items-end space-x-4 sm:space-x-6 mb-12 min-h-[320px] w-full z-10 relative">
  {characters.map((character) => (
    <div
      key={character.id}
      className="flex flex-col items-center cursor-pointer group relative"
      onDragOver={(e) => handleDragOver(e, character.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, character.id)}
      onClick={() => handleCharacterClick(character.id)}
    >
      {/* Contenedor principal de cada personaje */}
<div className="relative mb-3">
  {/* char1 */}
  {character.id === "char1" && (
    <div className="relative">
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/weirdlemon/weirdlemon2.PNG"
            : "/characters/weirdlemon/weirdlemon1.PNG"
        }
        alt="Weird Lemon"
        width={180}
        height={220}
        className="border-0 outline-none object-contain"
        priority
        draggable={false}
      />
    </div>
  )}

  {/* char2 */}
  {character.id === "char2" && (
    <div className="relative">
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/toad/toad2.PNG"
            : "/characters/toad/toad1.PNG"
        }
        alt="Toad"
        width={300}
        height={420}
        className="border-0 outline-none object-contain scale-110 sm:scale-125"
        style={{
          objectFit: "contain",
          maxWidth: "120%",
          height: "auto",
          zIndex: 20,
        }}
        priority
        draggable={false}
      />
    </div>
  )}

  {/* char3 */}
  {character.id === "char3" && (
    <div className="relative">
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/bloodrop/bloodrop2.PNG"
            : "/characters/bloodrop/bloodrop1.PNG"
        }
        alt="Bloodrop"
        width={220}
        height={300}
        className="border-0 outline-none object-contain"
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          height: "auto",
        }}
        priority
        draggable={false}
      />
    </div>
  )}

  {/* char4 */}
  {character.id === "char4" && (
    <div className="relative">
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/cutedragon/cutedragon2.PNG"
            : "/characters/cutedragon/cutedragon1.PNG"
        }
        alt="Cute Dragon"
        width={220}
        height={320}
        className="border-0 outline-none object-contain"
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          height: "auto",
        }}
        priority
        draggable={false}
      />
    </div>
  )}

  {/* char5 (con posicionamiento personalizado) */}
  {character.id === "char5" && (
    <div className="relative" style={{ left: "-80px", top: "-200px" }}>
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/lilghost/lilghost2.PNG"
            : "/characters/lilghost/lilghost1.PNG"
        }
        alt="Lil Ghost"
        width={300}
        height={300}
        className="border-0 outline-none object-contain"
        style={{
          objectFit: "contain",
          maxWidth: "100%",
          height: "auto",
        }}
        priority
        draggable={false}
      />
    </div>
  )}

  {/* char6 (con posicionamiento personalizado) */}
  {character.id === "char6" && (
    <div className="relative" style={{ left: "-90px", top: "-60px", zIndex: 15 }}>
      {dragOverCharacter === character.id && (
        <div
          className="absolute inset-0 bg-green-400 bg-opacity-30 rounded-full border-4 border-green-500 border-dashed animate-[pulse_1.5s_ease-in-out_infinite,scale_1.5s_ease-in-out_infinite]"
          style={{
            boxShadow: "0 0 15px rgba(134, 246, 59, 0.8), 0 0 30px rgba(75, 246, 59, 0.6)",
          }}
        ></div>
      )}
      <Image
        src={
          playingStatus[character.id]
            ? "/characters/gnome/gnome2.PNG"
            : "/characters/gnome/gnome1.PNG"
        }
        alt="Gnome"
        width={190}
        height={270}
        className="border-0 outline-none object-contain scale-110 sm:scale-125"
        style={{
          objectFit: "contain",
          maxWidth: "120%",
          height: "auto",
        }}
        priority
        draggable={false}
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
        </div>

        {/* Incredibox-style Interface */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
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

        {/* Instructions and Action Buttons
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
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
        </div> */}
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
