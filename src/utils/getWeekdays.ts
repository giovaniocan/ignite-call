export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
  })

  return Array.from(Array(7).keys()) // 7 posições
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day)))) // aqui é para pegar a data de acordo com a posição do array( dia da semana)
    .map((weekDay) => {
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1)) // isso é para deixar a primeira letra da string maiuscula
    })
}
