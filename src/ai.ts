import { sendTextMessageReply } from './nusacontact'
import { retrieveAnswerFromRagServer } from './rag'

export async function processBangAiRequest(
  sender: string,
  message: string,
  id: string,
  via: string,
) {
  const answer = await retrieveAnswerFromRagServer(message, sender)
  sendTextMessageReply(sender, answer, id, via)
}
