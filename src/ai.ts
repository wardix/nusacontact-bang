import { sendMessageReply } from './nusacontact'
import { retrieveAnswerFromRagServer } from './rag'
import { RAG_EXCUSE_DELAY_SECONDS, RAG_EXCUSE_MESSAGE } from './config'

export async function processBangAiRequest(
  sender: string,
  message: string,
  id: string,
  via: string,
) {
  const answer = await retrieveAnswerFromRagServer(message)
  const response = await sendMessageReply(sender, answer, id, via)
  if (response.messages[0].id) {
    await new Promise((resolve) =>
      setTimeout(resolve, Number(RAG_EXCUSE_DELAY_SECONDS) * 1000),
    )
    sendMessageReply(sender, RAG_EXCUSE_MESSAGE, response.messages[0].id, via)
  }
}
