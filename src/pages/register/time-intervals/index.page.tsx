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
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { getWeekDays } from '@/utils/getWeekdays'

export default function TimeIntervals() {
  const { register, control, watch, handleSubmit } = useForm({
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

  async function handleSetTimeIntervals() {}

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
        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}
