import { turso } from '@/lib/turso'

import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'

export const server = {
    sendForm: defineAction({
        input: z.object({
            name: z
                .string()
                .min(3, 'El nombre es muy corto')
                .max(50, 'El nombre es muy largo'),
            phone: z
                .string()
                .min(10, 'El número de teléfono es muy corto')
                .max(20, 'El número de teléfono es muy largo'),
            email: z.email('Debes ingresar un correo electrónico válido'),
            travel_time: z.enum(['0-3', '3-6', '6-12', '12-18', '0'], {
                message: 'Debes seleccionar un tiempo de viaje'
            })
        }),
        handler: async (input) => {
            const name = input.name.trim()
            const phone = input.phone.trim()
            const email = input.email.trim()
            const travel_time = input.travel_time

            if (email) {
                const data = await turso.execute({
                    sql: `SELECT email FROM customers WHERE email = ?`,
                    args: [email]
                })
                if (data.rows.length > 0) {
                    const data = await turso.execute({
                        sql: `UPDATE customers SET name = ?, phone = ?, travel_time = ?, recontact = ? WHERE email = ?`,
                        args: [name, phone, travel_time, 1, email]
                    })
                    return 'success'
                }
            }
            const data = await turso.execute({
                sql: `INSERT INTO customers (name, phone, email, travel_time) VALUES (?, ?, ?, ?)`,
                args: [name, phone, email, travel_time]
            })
            return 'success'
        }
    }),
    retriveList: defineAction({
        handler: async () => {
            const data = await turso.execute({
                sql: `SELECT * FROM customers`
            })
            return JSON.stringify(data)
        }
    })
}
