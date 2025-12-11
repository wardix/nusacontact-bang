import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'
import { processBangAiRequest } from './ai'
import { DEFAULT_COMMAND, PORT } from './config'
import { BookFlow } from './book'
  
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
  const command = commandMessage.substring(0, firstSpaceIndex).toLowerCase()
  const commandArguments = commandMessage.substring(firstSpaceIndex + 1)

  switch (command) {
    case '!ai':
      processBangAiRequest(sender, commandArguments, id, via)
    case '!pinjam_buku':
      BookFlow.assign(sender, id, via)
    case '!kembalikan_buku':
      BookFlow.return(sender, id, via)
      break
    default:
  }

  return context.json({ message: 'OK' })
})

export default {
  port: Number(PORT),
  fetch: app.fetch,
}
