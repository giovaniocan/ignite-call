import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from 'phosphor-react'

export function ClaimUserNameForm() {
  return (
    <Form as="form">
      <TextInput placeholder="seu-usuario" size="sm" prefix="ignite.com/" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
