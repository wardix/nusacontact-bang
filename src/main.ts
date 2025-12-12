import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'
import { processBangAiRequest } from './ai'
import {
  processBangBorrowBookRequest,
  processBangReturnBookRequest,
} from './book'
import { DEFAULT_COMMAND, PORT } from './config'

const app = new Hono()

app.use(logger())

app.use(
  '/bang',
  basicAuth({
    verifyUser: (username, password, _c) => {
      const validUser = JSON.parse(process.env.BASIC_USERS!)
      return validUser.includes(`${username}:${password}`)
    },
  }),
)

app.get('/', (context) => {
  return context.text('OK')
})

app.post('/bang', async (context) => {
  const { id, message, sender, via } = await context.req.json()

  const commandMessage = message.startsWith('!')
    ? message
    : `${DEFAULT_COMMAND} ${message}`
  const firstSpaceIndex = commandMessage.indexOf(' ')
  const command =
    firstSpaceIndex != -1
      ? commandMessage.substring(0, firstSpaceIndex).toLowerCase()
      : commandMessage
  const commandArguments =
    firstSpaceIndex != -1 ? commandMessage.substring(firstSpaceIndex + 1) : ''

  switch (command) {
    case '!ai':
      processBangAiRequest(sender, commandArguments, id, via)
      break
    case '!pinjam_buku':
      processBangBorrowBookRequest(sender, via)
      break
    case '!kembalikan_buku':
      processBangReturnBookRequest(sender, via)
      break
    default:
  }

  return context.json({ message: 'OK' })
})

export default {
  port: Number(PORT),
  fetch: app.fetch,
}
