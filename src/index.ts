import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'
import { processBangAiRequest } from './ai'

const port = process.env.PORT || 3000
const app = new Hono()

app.use(logger())

app.use('/bang', basicAuth({
  verifyUser: (username, password, _c) => {
    const validUser = JSON.parse(process.env.BASIC_USERS!)
    return validUser.includes(`${username}:${password}`)
  }
}))

app.get('/', (context) => {
  return context.text('Hello Hono!')
})

app.post('/bang', async (context) => {
  const { id, message, sender, via } = await context.req.json()

  const firstSpaceIndex = message.indexOf(' ')
  const command = message.substring(0, firstSpaceIndex).toLowerCase()
  const commandArguments = message.substring(firstSpaceIndex + 1)

  switch (command) {
    case '!ai':
      processBangAiRequest(sender, commandArguments, id, via)
      break
    default:
  }

  return context.json({ message: 'OK' })
})

export default {
  port: +port,
  fetch: app.fetch,
}
