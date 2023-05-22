/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  // http://localhost/api/user/jovani/availabitlity?date=2023-05-22 esse é um exemplo de como vai ser a nossa url quando chegar aqui, e como estamos pegamos atravez da requisão e da query
  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({
      message: 'date not provided.',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({
      message: 'username does not exist.',
    })
  }

  const referenceDate = dayjs(String(date)) // pegar a date atual e tranforma em um dayjs
  const isPastDate = referenceDate.endOf('day').isBefore(new Date()) // para verificar se a data que mandou é antes da data atual, nos fizemos isso na front, porém não podemos depender de validação vinda do cliente side

  if (isPastDate) {
    return res.status(400).json({ possibleTimes: [], availableTimes: [] }) // não existe disponobilidade nenhuma nesse dia, afinal, ele ja passou
  }

  const userAvalability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  }) // vai pegar o intervalo pré-definida, se ele colocou que na quinta ele estaria livre das 10 as 16 aqui nos vamos buscar isso, e como é semanal nos comparamos por fdia da semana

  if (!userAvalability) {
    return res.status(400).json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvalability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  // get, maior que ou igual á, lte, menos ou igual á, a gente cria um intervalo de valores
  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    return !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    )
  })
  return res.json({ possibleTimes, availableTimes })
}
