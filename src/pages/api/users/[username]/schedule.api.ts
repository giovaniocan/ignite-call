/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { google } from 'googleapis'
import { getGoogleOAuthToken } from '@/lib/google'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }
  const username = String(req.query.username)

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

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(), // converte qualquer tipo de data para um date form do JS
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body,
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'date must be in the future.',
    })
  }

  const conflictScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictScheduling) {
    return res.status(400).json({
      message: 'There is another scheduling at the same time.',
    })
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      name,
      email,
      observations,
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: { dateTime: schedulingDate.add(1, 'hour').format() },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        // para criar o meet da reunião
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).end()
}
