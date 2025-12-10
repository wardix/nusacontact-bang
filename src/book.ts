import { NusaContact } from './nusacontact'

export class BookFlow {

    static async assign(sender: string, id: string, via: string) {
        const payload = {
            type: "flow",
            body: {
                text: "Untuk melanjutkan proses peminjaman buku, silakan mengisi form berikut ini."
            },
            footer: {
                text: "Jika Anda membutuhkan bantuan, silakan menghubungi tim HR."
            },
            action: {
                name: "flow",
                parameters: {
                    flow_message_version: "3",
                    flow_token: sender,
                    flow_id: "3730707160571712",
                    flow_cta: "Pinjam Buku",
                    flow_action: "data_exchange"
                }
            }
        }
        return NusaContact.sendMessage(
            sender,
            via,
            "interactive",
            payload,
            id
        )
    }

    static async return(sender: string, id: string, via: string) {
        const payload = {
            type: "flow",
            body: {
                text: "Silakan lengkapi form berikut untuk mengonfirmasi pengembalian buku."
            },
            footer: {
                text: "Terima kasih telah mengembalikan buku tepat waktu."
            },
            action: {
                name: "flow",
                parameters: {
                    flow_message_version: "3",
                    flow_token: sender,
                    flow_id: "26164432729811783",
                    flow_cta: "Kembalikan Buku",
                    flow_action: "data_exchange"
                }
            }
        }
        return NusaContact.sendMessage(
            sender,
            via,
            "interactive",
            payload,
            id
        )
    }
}
