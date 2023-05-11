import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuario precisa ter no minino 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'o usuario pode ter apenas letras e hifnes',
    }) // aqui diz que só entre se for uma coisa de a á z e um '-', esse '+' é para dizer que isso pode se repetir, ou seja, pode ter mais de umaletra ou um '-', e  esse 'i' quer dizer que pode letra maisuscula
    .transform((username) => username.toLowerCase()), // aqui ele tranforma qualquer letra maiscula em minuscula
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data
    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          placeholder="seu-usuario"
          size="sm"
          prefix="ignite.com/"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuario '}
        </Text>
      </FormAnnotation>
    </>
  )
}
