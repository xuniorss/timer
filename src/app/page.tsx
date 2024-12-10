'use client'

import { TimerProps } from '@/types/timer'
import React, { useEffect, useState } from 'react'
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
            originalTime: 5 * 60,
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
            timer.id === id
               ? {
                    ...timer,
                    isRunning: !timer.isRunning,
                    startTime: !timer.isRunning ? Date.now() : undefined, // Define timestamp ao iniciar
                 }
               : timer
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

   useEffect(() => {
      const interval = setInterval(() => {
         setTimers((prevTimers) =>
            prevTimers.map((timer) => {
               if (timer.isRunning) {
                  const elapsedTime = Math.floor(
                     (Date.now() - (timer.startTime || Date.now())) / 1000
                  )
                  const remainingTime = Math.max(
                     timer.originalTime - elapsedTime,
                     0
                  )

                  // Se o tempo chegar a zero, resetamos o timer
                  if (remainingTime === 0) {
                     return {
                        ...timer,
                        time: timer.originalTime, // Reseta para o tempo original
                        isRunning: false, // Pausa o timer
                        startTime: undefined, // Remove o timestamp de início
                     }
                  }

                  return { ...timer, time: remainingTime }
               }
               return timer
            })
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
