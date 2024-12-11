'use client'

import { TimerProps } from '@/types/timer'
import { formatAsTime } from '@/utils/formatAsTime'
import { formatTime } from '@/utils/formatTime'
import { parseTime } from '@/utils/parseTime'
import { Pause, Play, RotateCcw, Trash2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

export const Timer: React.FC<{
   timer: TimerProps
   onUpdate: (id: number, newTime: number, originalTime?: number) => void
   onToggle: (id: number) => void
   onRename: (id: number, newName: string) => void
   onRemove: (id: number) => void
   onReset: (id: number) => void
}> = ({ timer, onUpdate, onToggle, onRename, onRemove, onReset }) => {
   const [editMode, setEditMode] = useState(false)
   const [nameEditMode, setNameEditMode] = useState(false)
   const [inputValue, setInputValue] = useState(formatTime(timer.time))
   const [nameValue, setNameValue] = useState(timer.name)

   const handleInputFocus = () => {
      setInputValue('00:00:00') // Limpa o valor ao focar no campo
   }

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '') // Permite apenas números
      const formatted = formatAsTime(value) // Formata para hh:mm:ss
      setInputValue(formatted)
   }

   const handleInputBlur = () => {
      const newTime = parseTime(inputValue)
      onUpdate(timer.id, newTime || 0, newTime || 0)
      setInputValue(formatTime(newTime || 0))
      setEditMode(false)
   }

   const handleNameBlur = () => {
      onRename(timer.id, nameValue)
      setNameEditMode(false)
   }

   return (
      <div className="w-56 p-4 rounded-md bg-neutral-700 h-44 flex flex-col justify-between items-center">
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
               className="cursor-pointer font-bold mb-8 text-white"
            >
               {nameValue || 'Sem Nome'}
            </div>
         )}

         <div className="h-full flex flex-col items-center justify-between">
            {editMode ? (
               <input
                  type="text"
                  value={inputValue}
                  onFocus={handleInputFocus}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="w-[6.25rem] text-center"
               />
            ) : (
               <span
                  onClick={() => {
                     setInputValue('') // Limpa ao iniciar a edição
                     setEditMode(true)
                  }}
                  className="cursor-pointer w-[6.25rem] text-lg text-white text-center"
               >
                  {formatTime(timer.time)}
               </span>
            )}
            <div>
               <button onClick={() => onToggle(timer.id)}>
                  {timer.isRunning ? (
                     <Pause color="yellow" />
                  ) : (
                     <Play color="green" />
                  )}
               </button>
               {timer.isRunning && (
                  <button
                     onClick={() => onReset(timer.id)}
                     style={{ marginLeft: '10px' }}
                  >
                     <RotateCcw color="blue" />
                  </button>
               )}
               <button
                  onClick={() => onRemove(timer.id)}
                  style={{ marginLeft: '10px' }}
               >
                  <Trash2 color="red" />
               </button>
            </div>
         </div>
      </div>
   )
}
