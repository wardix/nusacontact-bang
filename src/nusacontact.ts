import axios, { AxiosInstance } from 'axios'

const PHONE_IDS: string[] = JSON.parse(process.env.NUSACONTACT_PHONE_NUMBER_IDS || '[]')

const API_URL = process.env.NUSACONTACT_MESSAGES_API_URL || ''
const API_URL_TEST = process.env.NUSACONTACT_MESSAGES_API_TEST_URL || ''

const API_KEY = process.env.NUSACONTACT_API_KEY || ''
const API_KEY_TEST = process.env.NUSACONTACT_API_TEST_KEY || ''

const MAX_RETRIES = 5

export class NusaContact {
    private static getClient(via: string): AxiosInstance {
        const isProd = PHONE_IDS.includes(via)

        return axios.create({
            baseURL: isProd ? API_URL : API_URL_TEST,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-Api-Key": isProd ? API_KEY : API_KEY_TEST,
            }
        })
    }

    private static async send(via: string, payload: any) {
        const client = this.getClient(via)
        let attempts = 0

        while (attempts < MAX_RETRIES) {
            try {
                const res = await client.post('', payload, {
                    params: { phone_number_id: via }
                })

                if (res.status === 200) return res.data
                if (res.status === 429) {
                    attempts++
                    await new Promise(r => setTimeout(r, 1000))
                    continue
                }

                return null
            } catch (err: any) {
                attempts++
                const status = err?.response?.status

                if (status === 429 && attempts < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, 1000))
                    continue
                }

                return null
            }
        }

        return null
    }

    static async sendMessageReply(to: string, message: string, id: string, via: string) {
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            context: { message_id: id },
            type: "text",
            text: { body: message }
        }

        return this.send(via, payload)
    }

    static async sendMessage(
        to: string,
        via: string,
        type: string,
        params: any,
        id: string
    ) {
        const payload = {
            messaging_product: "whatsapp",
            to,
            context: { message_id: id },
            type,
            [type]:params
        }
        return this.send(via, payload)
    }
}
