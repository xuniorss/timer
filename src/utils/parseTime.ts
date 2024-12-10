export const parseTime = (formattedTime: string): number => {
   const [hours, minutes, seconds] = formattedTime.split(':').map(Number)
   return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
}
