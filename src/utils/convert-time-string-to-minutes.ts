export function ConvertTimeStringToMinutes(timeString: string) {
  const [hours, minutes] = timeString.split(':').map(Number) // 1º separa a string por ':', 2ºestou pegando essa string e tranformando em um number

  return hours * 60 + minutes // retorna os minutos
}
