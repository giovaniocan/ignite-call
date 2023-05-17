import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'

import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { getWeekDays } from '@/utils/getWeekdays'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enable: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7) // especificar o tamanho, mas não é necessarios
    .transform(
      (
        intervals, // pegando o array original
      ) => intervals.filter((interval) => interval.enable), // to filtrando um novo array, onde so tem dias que esta marcado
    )
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    }) // esse refine é o modo de validar o novo array, aqui estamos falando que se stiver vaio ele não vai mandar
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: ConvertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: ConvertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes, // tem que estar uma hora de diferença
        ) // esse every aplicada a condição para todas as posições do array
      },
      {
        message:
          'A hora de término precisa ser pelo menos uma hora depois do inicio',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema> // dados de entrada
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema> // dados de saida

export default function TimeIntervals() {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enable: false,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 1,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 2,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 3,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 4,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 5,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 6,
          enable: false,
          startTime: '08:00',
          endTime: '18:00',
        },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control, // control do useForm para saber que te lidando com aquele formulario
    name: 'intervals', // nome do campo
  })

  const interval = watch('intervals') // ele fica observando os campos que mudaram de todo o form( pq o nome é intervals)

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput
    await api.post('/users/time-intervals', { intervals })
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">quase lá</Heading>
        <Text>
          Defina o intervalo de horário que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller // esse controller é para saber se o checkbox esta ativo ou nao, quando o eleemento do jook form não é nativo do html
                    name={`intervals.${index}.enable`}
                    control={control} // aqui que controla os valores
                    render={({ field }) => {
                      // ela que renderiza o componente
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value} // ajuda a recuperar o valor original
                        />
                      )
                    }}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={interval[index].enable === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={interval[index].enable === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalsContainer>
        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}
        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
