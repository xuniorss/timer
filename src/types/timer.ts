export type TimerProps = {
   id: number
   name: string
   time: number // tempo em segundos
   originalTime: number // tempo inicial definido pelo usuário
   isRunning: boolean
}