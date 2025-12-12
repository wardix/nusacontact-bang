import axios from 'axios'
import {
  NUSACONTACT_API_KEY,
  NUSACONTACT_API_TEST_KEY,
  NUSACONTACT_MAX_RETRIES,
  NUSACONTACT_MESSAGES_API_TEST_URL,
  NUSACONTACT_MESSAGES_API_URL,
  NUSACONTACT_PHONE_NUMBER_IDS,
} from './config'

async function sendMessage(to: string, messageData: any, via: string) {
  let attempts = 0
  const isProduction = NUSACONTACT_PHONE_NUMBER_IDS.includes(via)
  const apiUrl = isProduction
    ? NUSACONTACT_MESSAGES_API_URL
    : NUSACONTACT_MESSAGES_API_TEST_URL
  const apiKey = isProduction ? NUSACONTACT_API_KEY : NUSACONTACT_API_TEST_KEY

  const url = `${apiUrl}?phone_number_id=${via}`
  const data = {
    ...messageData,
    to,
  }
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
  }
  while (attempts < NUSACONTACT_MAX_RETRIES) {
    const response = await axios.post(url, data, { headers })
    if (response.status === 200) {
      console.log('Message sent successfully')
      return response.data
    }
    if (response.status === 429) {
      attempts++
      console.warn(`Rate limit hit. Retrying request... Attempt ${attempts}`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second
    } else {
      console.error(`Failed to send message. Status: ${response.status}`)
      return null
    }
  }
}

export async function sendTextMessage(
  to: string,
  message: string,
  via: string,
) {
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'text',
    text: { body: message },
  }
  return await sendMessage(to, data, via)
}

export async function sendFlowMessage(to: string, flow: any, via: string) {
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    type: 'interactive',
    interactive: flow,
  }
  return await sendMessage(to, data, via)
}

export async function sendTextMessageReply(
  to: string,
  message: string,
  messageId: string,
  via: string,
) {
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    context: { message_id: messageId },
    type: 'text',
    text: { body: message },
  }
  return await sendMessage(to, data, via)
}
