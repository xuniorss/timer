'use client'

import React, { useState } from 'react'

type Timer = {
   id: number
   name: string
   time: number // tempo em segundos
   isRunning: boolean
}

const formatTime = (time: number) => {
   const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, '0')
   const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, '0')
   const seconds = (time % 60).toString().padStart(2, '0')
   return `${hours}:${minutes}:${seconds}`
}

const Timer: React.FC<{
   timer: Timer
   onUpdate: (id: number, newTime: number) => void
   onToggle: (id: number) => void
   onRename: (id: number, newName: string) => void
}> = ({ timer, onUpdate, onToggle, onRename }) => {
   const [editMode, setEditMode] = useState(false)
   const [nameEditMode, setNameEditMode] = useState(false)
   const [inputValue, setInputValue] = useState(formatTime(timer.time))
   const [nameValue, setNameValue] = useState(timer.name)

   // Formata o tempo em hh:mm:ss

   // Converte uma string formatada (hh:mm:ss) em segundos
   const parseTime = (formattedTime: string): number => {
      const [hours, minutes, seconds] = formattedTime.split(':').map(Number)
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9:]/g, '') // Permite apenas números e ":"
      const parts = value.split(':').map((part) => part.padStart(2, '0'))
      const formatted = parts.join(':').substring(0, 8) // Limita ao formato hh:mm:ss
      setInputValue(formatted)
   }

   const handleInputBlur = () => {
      const newTime = parseTime(inputValue)
      onUpdate(timer.id, newTime)
      setInputValue(formatTime(newTime)) // Garante que o formato fique correto
      setEditMode(false)
   }

   const handleNameBlur = () => {
      onRename(timer.id, nameValue)
      setNameEditMode(false)
   }

   return (
      <div style={{ marginBottom: '10px' }}>
         {nameEditMode ? (
            <input
               type="text"
               value={nameValue}
               onChange={(e) => setNameValue(e.target.value)}
               onBlur={handleNameBlur}
               autoFocus
               style={{ width: '100%', marginBottom: '5px' }}
            />
         ) : (
            <div
               onClick={() => setNameEditMode(true)}
               style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '5px',
               }}
            >
               {nameValue || 'Sem Nome'}
            </div>
         )}

         <div style={{ display: 'flex', alignItems: 'center' }}>
            {editMode ? (
               <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  style={{ width: '100px', textAlign: 'center' }}
               />
            ) : (
               <span
                  onClick={() => {
                     setInputValue(formatTime(5 * 60)) // Default para 5 minutos ao editar
                     setEditMode(true)
                  }}
                  style={{
                     cursor: 'pointer',
                     width: '100px',
                     textAlign: 'center',
                  }}
               >
                  {formatTime(timer.time)}
               </span>
            )}
            <button onClick={() => onToggle(timer.id)}>
               {timer.isRunning ? 'Pause' : 'Play'}
            </button>
         </div>
      </div>
   )
}

export default function Home() {
   const [timers, setTimers] = useState<Timer[]>([])

   const addTimer = () => {
      setTimers((prevTimers) => [
         ...prevTimers,
         {
            id: Date.now(),
            name: '',
            time: 5 * 60, // Default 5 minutos
            isRunning: false,
         },
      ])
   }

   const updateTimer = (id: number, newTime: number) => {
      setTimers((prevTimers) =>
         prevTimers.map((timer) =>
            timer.id === id ? { ...timer, time: newTime } : timer
         )
      )
   }

   const toggleTimer = (id: number) => {
      setTimers((prevTimers) =>
         prevTimers.map((timer) =>
            timer.id === id ? { ...timer, isRunning: !timer.isRunning } : timer
         )
      )
   }

   const renameTimer = (id: number, newName: string) => {
      setTimers((prevTimers) =>
         prevTimers.map((timer) =>
            timer.id === id ? { ...timer, name: newName } : timer
         )
      )
   }

   React.useEffect(() => {
      const interval = setInterval(() => {
         setTimers((prevTimers) =>
            prevTimers.map((timer) =>
               timer.isRunning && timer.time > 0
                  ? { ...timer, time: timer.time - 1 }
                  : timer
            )
         )
      }, 1000)
      return () => clearInterval(interval)
   }, [])

   return (
      <div style={{ padding: '20px' }}>
         <h1>Timers</h1>
         {timers.map((timer) => (
            <Timer
               key={timer.id}
               timer={timer}
               onUpdate={updateTimer}
               onToggle={toggleTimer}
               onRename={renameTimer}
            />
         ))}
         <button onClick={addTimer} style={{ marginLeft: timers.length * 10 }}>
            + Adicionar Timer
         </button>
      </div>
   )
}
