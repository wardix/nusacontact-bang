import {
  ORGANIZATION_ID,
  RAG_SERVER_API_URL,
  RAG_SERVER_AUTHZ_HEADER,
} from './config'

export async function retrieveAnswerFromRagServer(
  question: string,
  session: string = '',
): Promise<string> {
  const url = RAG_SERVER_API_URL
  const authorizationHeader = RAG_SERVER_AUTHZ_HEADER
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorizationHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        session_id: session,
        organization_id: ORGANIZATION_ID,
      }),
    })
    const data = await response.json()
    return data.data[0]
  } catch (error) {
    console.error(error)
  }
  return ''
}
