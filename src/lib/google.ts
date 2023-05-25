/* eslint-disable camelcase */
import { google } from 'googleapis'
import { prisma } from './prisma'
import dayjs from 'dayjs'

export async function getGoogleOAuthToken(userID: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userID,
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    // autenticando no google
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
  })

  if (!account.expires_at) {
    return auth
  }

  // verificar se a data de validação do token é antes da data atual
  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    })

    auth.setCredentials({
      // autenticando no google
      access_token,
      refresh_token,
      expiry_date,
    })
  }

  return auth
}