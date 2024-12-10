'use client'

import { TimerProps } from '@/types/timer'
import React, { useState } from 'react'
import { Timer } from './components/Timer'

export default function Home() {
   const [timers, setTimers] = useState<TimerProps[]>([])

   const addTimer = () => {
      setTimers((prevTimers) => [
         ...prevTimers,
         {
            id: Date.now(),
            name: '',
            time: 5 * 60, // Default 5 minutos
            originalTime: 5 * 60, // Tempo original
            isRunning: false,
         },
      ])
   }

   const updateTimer = (id: number, newTime: number, originalTime?: number) => {
      setTimers((prevTimers) =>
         prevTimers.map((timer) =>
            timer.id === id
               ? {
                    ...timer,
                    time: newTime,
                    originalTime: originalTime ?? timer.originalTime,
                 }
               : timer
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

   const resetTimer = (id: number) => {
      setTimers((prevTimers) =>
         prevTimers.map((timer) =>
            timer.id === id
               ? { ...timer, time: timer.originalTime, isRunning: false }
               : timer
         )
      )
   }

   const removeTimer = (id: number) => {
      setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id))
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
               timer.isRunning
                  ? timer.time > 0
                     ? { ...timer, time: timer.time - 1 }
                     : { ...timer, time: timer.originalTime, isRunning: false } // Reseta ao valor original
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
               onRemove={removeTimer}
               onReset={resetTimer}
            />
         ))}
         <button onClick={addTimer} style={{ marginLeft: timers.length * 10 }}>
            + Adicionar Timer
         </button>
      </div>
   )
}
