export async function sendMessageReply(
  to: string,
  message: string,
  id: string,
  via: string,
) {
  const nusacontactPhoneNumberIds = JSON.parse(
    process.env.NUSACONTACT_PHONE_NUMBER_IDS!,
  )
  const isProduction = nusacontactPhoneNumberIds.includes(via)
  const apiUrl = isProduction
    ? process.env.NUSACONTACT_MESSAGES_API_URL
    : process.env.NUSACONTACT_MESSAGES_API_TEST_URL
  const apiKey = isProduction
    ? process.env.NUSACONTACT_API_KEY
    : process.env.NUSACONTACT_API_TEST_KEY

  const url = `${apiUrl}?phone_number_id=${via}`

  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    context: { message_id: id },
    type: 'text',
    text: { body: message },
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify(data),
  }

  fetch(url, options).catch((error) => console.error('Error', error))
}
