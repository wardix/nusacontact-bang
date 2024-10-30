import axios from 'axios'

export async function sendMessageReply(
  to: string,
  message: string,
  id: string,
  via: string,
) {
  const maxRetries = 5 // Set a maximum retry limit
  let attempts = 0

  try {
    const nusacontactPhoneNumberIds = JSON.parse(
      process.env.NUSACONTACT_PHONE_NUMBER_IDS || '[]',
    )
    const isProduction = nusacontactPhoneNumberIds.includes(via)
    const apiUrl = isProduction
      ? process.env.NUSACONTACT_MESSAGES_API_URL
      : process.env.NUSACONTACT_MESSAGES_API_TEST_URL
    const apiKey = isProduction
      ? process.env.NUSACONTACT_API_KEY
      : process.env.NUSACONTACT_API_TEST_KEY

    if (!apiUrl || !apiKey) {
      throw new Error('Missing API URL or API Key in environment variables.')
    }

    const url = `${apiUrl}?phone_number_id=${via}`
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      context: { message_id: id },
      type: 'text',
      text: { body: message },
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    }

    while (attempts < maxRetries) {
      const response = await axios.post(url, data, { headers })
      if (response.status === 200) {
        console.log('Message sent successfully')
        return response.data
      } else if (response.status === 429) {
        attempts++
        console.warn(`Rate limit hit. Retrying request... Attempt ${attempts}`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second
      } else {
        console.error(`Failed to send message. Status: ${response.status}`)
        return null
      }
    }

    console.error(
      'Max retries reached. Failed to send message after multiple attempts.',
    )
    return null
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
