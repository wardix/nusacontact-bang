import { sendMessageReply } from "./nusacontact"
import { retrieveAnswerFromRagChain } from "./rag"

export async function processBangAiRequest(
  sender: string,
  message: string,
  id: string,
  via: string,
) {
  const answer = await retrieveAnswerFromRagChain(message)
  sendMessageReply(sender, answer, id, via)
}
