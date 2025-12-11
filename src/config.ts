export const PORT = process.env.PORT || 3000
export const RAG_SERVER_API_URL = process.env.RAG_SERVER_API_URL!
export const RAG_SERVER_AUTHZ_HEADER = process.env.RAG_SERVER_AUTHZ_HEADER!
export const DEFAULT_COMMAND = process.env.DEFAULT_COMMAND || '!ai'
export const ORGANIZATION_ID = Number(process.env.ORGANIZATION_ID || 1)
export const NUSACONTACT_PHONE_NUMBER_IDS = JSON.parse(
  process.env.NUSACONTACT_PHONE_NUMBER_IDS || '[]',
)
export const NUSACONTACT_MESSAGES_API_URL =
  process.env.NUSACONTACT_MESSAGES_API_URL || 'http://localhost:3000/messages'
export const NUSACONTACT_MESSAGES_API_TEST_URL =
  process.env.NUSACONTACT_MESSAGES_API_TEST_URL ||
  'http://localhost:3000/messages'
export const NUSACONTACT_API_KEY = process.env.NUSACONTACT_API_KEY || 'xxxxxxxx'
export const NUSACONTACT_API_TEST_KEY =
  process.env.NUSACONTACT_API_TEST_KEY || 'xxxxxxxx'
export const NUSACONTACT_MAX_RETRIES = Number(
  process.env.NUSACONTACT_MAX_RETRIES || 5,
)
