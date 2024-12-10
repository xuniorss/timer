export const formatAsTime = (value: string): string => {
   const seconds = value.slice(-2).padStart(2, '0')
   const minutes = value.slice(-4, -2).padStart(2, '0')
   const hours = value.slice(-6, -4).padStart(2, '0')
   return `${hours}:${minutes}:${seconds}`
}
