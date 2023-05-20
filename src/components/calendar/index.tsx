import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'
import { getWeekDays } from '@/utils/getWeekdays'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = Array<CalendarWeek>

export function Calendar() {
  const shortWeekDays = getWeekDays({ short: true })

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1) // a data inicial é o 1 de cada mÊs
  })

  function handlePreviousMonth() {
    const previusMonthDate = currentDate.subtract(1, 'month') // aqui a gente pega a data atual, e subtrai alguma coisa de alguma medida, aqui é 1 mÊs

    setCurrentDate(previusMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, 'month') // aqui a gente pega a data atual, e subtrai alguma coisa de alguma medida, aqui é 1 mÊs

    setCurrentDate(nextMonthDate)
  }

  const currentMonth = currentDate.format('MMMM') // é o mês por extenso
  const currentYear = currentDate.format('YYYY') // é o ano por extenso

  // vamos usar o useMemo para ele guardar na memoria essa operação, pq so vai mudar uma vez no mês, então não compensa o processamento de cada renderização
  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(), // quantidade de dias no mês
    }).map((_, i) => {
      return currentDate.set('date', i + 1) // date é o dia do mes em js, o day é o dia da semana
    })

    const firstWeekDay = currentDate.get('day')

    const previusMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day') // aqui vai pegar os dias que faltam para o primeiro dia do mês, tudo em dia de semana
      })
      .reverse()

    const lasDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lasDayInCurrentMonth.get('day')

    const nexMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lasDayInCurrentMonth.add(i + 1, 'day') // aqui vai pegar os dias que faltam para o ultimo dia do mÊs, tudo em dia de semana
    })

    const calendarDays = [
      ...previusMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled: date.endOf('day').isBefore(new Date()),
        }
      }),
      ...nexMonthFillArray.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate])

  console.log(calendarWeeks)

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="previus month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ days, week }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay disabled={disabled}>
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
