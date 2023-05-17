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

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDays: z.number().min(0).max(6),
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
    }), // esse refine é o modo de validar o novo array, aqui estamos falando que se stiver vaio ele não vai mandar
})

type TimeIntervalsFormData = z.infer<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDays: 0,
          enable: false,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 1,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 2,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 3,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 4,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 5,
          enable: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDays: 6,
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

  async function handleSetTimeIntervals(data: TimeIntervalsFormData) {
    console.log(data)
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
                  <Text>{weekDays[field.weekDays]}</Text>
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
