"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { saveCombinationToFirebase } from "./api/saveCombination"
import { getCombinationsFromFirebase, Combination } from "./api/getCombinations";
import { deleteCombinationFromFirebase } from "./api/deleteCombinations";
import { signInWithGoogle, logout, onAuthChange } from "../firebase.auth";

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

  

   // Nuevos estados para almacenar las combinaciones obtenidas
  const [savedCombinations, setSavedCombinations] = useState<Combination[]>([]);
  const [loadingCombinations, setLoadingCombinations] = useState(true);
  const [combinationsError, setCombinationsError] = useState<string | null>(null);
  // Estado para controlar el borrado
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Estado de usuario autenticado
  type AuthUser = {
    displayName?: string | null;
    email?: string | null;
    [key: string]: any;
  };
  const [user, setUser] = useState<AuthUser | null>(null);

  // Efecto para obtener las combinaciones al montar el componente
  useEffect(() => {
    const fetchCombinations = async () => {
      setLoadingCombinations(true);
      setCombinationsError(null);
      try {
        if (!user || !user.uid) {
          setSavedCombinations([]);
          setLoadingCombinations(false);
          return;
        }
        const combinations = await getCombinationsFromFirebase(user.uid);
        setSavedCombinations(combinations);
      } catch (error) {
        console.error("Error al obtener las combinaciones:", error);
        setCombinationsError("Error al cargar las combinaciones. Intenta de nuevo más tarde.");
      } finally {
        setLoadingCombinations(false);
      }
    };
    fetchCombinations();
  }, [user]);
  
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

  const [saveName, setSaveName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState("")

  const handleSaveCombination = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError("")
    const selectedSounds = characters
      .filter((char) => char.assignedSound)
      .map((char) => char.assignedSound?.name || "")
    if (!saveName.trim()) {
      setSaveError("Ponle un nombre a tu combinación.")
      setSaving(false)
      return
    }
    if (selectedSounds.length === 0) {
      setSaveError("Asigna al menos un sonido a un personaje.")
      setSaving(false)
      return
    }
    if (!user || !user.uid) {
      setSaveError("Debes iniciar sesión para guardar combinaciones.")
      setSaving(false)
      return
    }
    try {
      await saveCombinationToFirebase(user.uid, { name: saveName, sounds: selectedSounds })
      setSaveSuccess(true)
      setSaveName("")
      // Refrescar combinaciones
      const combinations = await getCombinationsFromFirebase(user.uid)
      setSavedCombinations(combinations)
    } catch (e) {
      setSaveError("Error al guardar la combinación.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCombination = async (id: string) => {
    setDeletingId(id);
    if (!user || !user.uid) {
      setCombinationsError("Debes iniciar sesión para borrar combinaciones.");
      setDeletingId(null);
      return;
    }
    try {
      await deleteCombinationFromFirebase(user.uid, id);
      // Refrescar combinaciones
      const combinations = await getCombinationsFromFirebase(user.uid);
      setSavedCombinations(combinations);
    } catch (e) {
      setCombinationsError("Error al borrar la combinación.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadCombination = (combination: Combination) => {
    const assignedSounds = combination.sounds.map((soundName, idx) => {
      const found = soundElements.find(se => se.name === soundName) || null;
      return found;
    });

    setCharacters(prev =>
      prev.map((char, idx) => {
        const assignedSound = assignedSounds[idx] || null;
        return {
          ...char,
          assignedSound,
          isActive: !!assignedSound,
        };
      })
    );

    // Esperar a que el estado se actualice antes de iniciar el beat
    setTimeout(() => {
      setCharacters(currentChars => {
        startGlobalBeat(
          currentChars.map((char, idx) => {
            const assignedSound = assignedSounds[idx] || null;
            return {
              ...char,
              assignedSound,
              isActive: !!assignedSound,
            };
          })
        );
        return currentChars.map((char, idx) => {
          const assignedSound = assignedSounds[idx] || null;
          return {
            ...char,
            assignedSound,
            isActive: !!assignedSound,
          };
        });
      });
    }, 0);
  };

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

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthChange(setUser);
    return () => unsubscribe();
  }, []);

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
        <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">APP</a>
        <a href="#" className="text-black font-bold border-b-2 border-black pb-1">DEMO</a>
        <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">PLAYLIST</a>
        <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">ALBUMS</a>
        <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors duration-200">SHOP</a>
      </nav>

      {/* Social Icons & Auth */}
      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center space-x-3">
          <SocialIcon icon="f" href="#" />
          <SocialIcon icon="𝕏" href="#" />
          <SocialIcon icon="▶" href="#" />
          <SocialIcon icon="📷" href="#" />
          <SocialIcon icon="🎵" href="#" />
          <SocialIcon icon="t" href="#" />
        </div>

        {/* Language selector */}
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

        {/* Auth info */}
{user ? (
  <div className="flex items-center space-x-4 ml-4">
    <img
      src={user.photoURL || '/default-avatar.png'}
      alt="Perfil"
      className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
    />
    <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">{user.displayName || user.email}</span>
<button
  onClick={logout}
  className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded shadow-sm transition"
>
  Cerrar sesión
</button>

  </div>
) : (
  <button
    onClick={signInWithGoogle}
    className="ml-4 flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
  >
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google"
      className="w-5 h-5 mr-2"
    />
    <span className="text-sm text-gray-800 font-medium">Iniciar sesión con Google</span>
  </button>
)}

      </div>
    </div>
  </div>
</header>

      {/* Main Content Area */}
           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Columna Derecha: Sección de Combinaciones Guardadas (Playlist) */}
        <div
          className="w-full lg:w-75 flex-shrink-0 absolute lg:top 10 lg:right-3" // <-- ¡CAMBIO AQUÍ!
          style={{ zIndex: 5 }} // Opcional: Asegura que esté por encima de otros elementos
        >
          <section id="playlist" className="bg-white rounded-3xl shadow-2xl p-3 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Combinaciones Guardadas</h2>
            {loadingCombinations && (
              <p className="text-center text-gray-600 text-lg">Cargando combinaciones...</p>
            )}
            {combinationsError && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center font-medium">
                {combinationsError}
              </div>
            )}
            {!loadingCombinations && savedCombinations.length === 0 && !combinationsError && (
              <p className="text-center text-gray-600 text-lg">¡No hay combinaciones guardadas aún! Guarda una para verla aquí.</p>
            )}
            {!loadingCombinations && savedCombinations.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {savedCombinations.map((combination) => (
                  <div
                    key={combination.id}
                    className="bg-gray-50 p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex items-start justify-between cursor-pointer"
                    onClick={() => handleLoadCombination(combination)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{combination.name}</h3>
                      <p className="text-gray-700 text-xs mb-2">ID: <span className="font-mono text-gray-600 text-xs">{combination.id.substring(0, 8)}...</span></p>
                      <div className="flex flex-wrap gap-1">
                        {combination.sounds.map((sound: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                          >
                            {sound}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Botón de eliminar */}
                    <button
                      className="ml-3 mt-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                      title="Eliminar combinación"
                      onClick={() => handleDeleteCombination(combination.id)}
                      disabled={deletingId === combination.id}
                    >
                      {/* Ícono de basura SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${deletingId === combination.id ? "opacity-50" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 bg-orange-400 rounded-full animate-pulse"></div>
            <div className="absolute top-12 right-8 w-6 h-6 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-8 left-12 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-purple-400 rounded-full animate-pulse"></div>
          </div>

          {/* Control Panel (mejorado y más dinámico) */}
          <div className="flex flex-col items-center justify-center space-y-6 mb-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-10 py-4 rounded-full font-bold shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-3"
              >
                🔄 RESET
              </Button>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="✨ Nombre tu obra maestra..."
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  className="border-2 border-gray-300 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 transform focus:scale-105 bg-white shadow-lg"
                  style={{ minWidth: 280 }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400 animate-pulse">🎵</span>
                </div>
              </div>
              
              <Button
                onClick={handleSaveCombination}
                className={`${
                  saving 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                } text-white px-10 py-4 rounded-full font-bold shadow-xl transform hover:scale-110 transition-all duration-300 hover:-rotate-3`}
                disabled={saving}
              >
                {saving ? '⏳ GUARDANDO...' : '💾 GUARDAR COMBINACIÓN'}
              </Button>
            </div>
            
            {/* Mensajes de estado más atractivos */}
            {saveSuccess && (
              <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-bold px-6 py-3 rounded-2xl shadow-lg animate-bounce border-l-4 border-green-500">
                ✅ ¡Combinación guardada exitosamente!
              </div>
            )}
            {saveError && (
              <div className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 font-bold px-6 py-3 rounded-2xl shadow-lg animate-shake border-l-4 border-red-500">
                ❌ {saveError}
              </div>
            )}
          </div>

          {/* Sound Elements Section: disposición piramidal escaleno */}
          <div className="relative flex flex-col items-center space-y-8">
            {/* Fila superior - 2 elementos (Beats) */}
            <div className="flex space-x-8">
              {soundElements
                .filter((el) => el.category === "beats")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-20 h-20 ${element.color} hover:bg-orange-500 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:scale-125 hover:rotate-12 active:scale-110`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drop-shadow-lg">{element.symbol}</span>
                  </div>
                ))}
            </div>

            {/* Fila media-superior - 3 elementos (Effects) */}
            <div className="flex space-x-6">
              {soundElements
                .filter((el) => el.category === "effects")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-20 h-20 ${element.color} hover:bg-blue-500 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:scale-125 hover:-rotate-12 active:scale-110`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drop-shadow-lg">{element.symbol}</span>
                  </div>
                ))}
            </div>

            {/* Fila media-inferior - 4 elementos (Melodies) */}
            <div className="flex space-x-5">
              {soundElements
                .filter((el) => el.category === "melodies")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-20 h-20 ${element.color} hover:bg-green-500 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:scale-125 hover:rotate-6 active:scale-110`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drop-shadow-lg">{element.symbol}</span>
                  </div>
                ))}
            </div>

            {/* Fila inferior - 5 elementos (Voices) */}
            <div className="flex space-x-4">
              {soundElements
                .filter((el) => el.category === "voices")
                .map((element) => (
                  <div
                    key={element.id}
                    className={`w-20 h-20 ${element.color} hover:bg-purple-500 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:scale-125 hover:-rotate-6 active:scale-110`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drop-shadow-lg">{element.symbol}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Indicadores de arrastre */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-pulse">
            ↗️ Arrastra los elementos para crear tu mezcla ↖️
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
