import { defineAction } from 'astro:actions'
import { z } from 'astro/zod'

type FormData = {
    name: string
    phone: string
    email: string
    travel_time: '0-3' | '3-6' | '6-12' | '12-18' | '0'
    referralCode: string
}

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
            }),
            referralCode: z
                .string()
                .max(100, 'El código de referido es muy largo')
        }),
        handler: async (input: FormData) => {
            const name = input.name.trim()
            const phone = input.phone.trim()
            const email = input.email.trim()
            const travel_time = input.travel_time
            const referralCode = input.referralCode

            if (email) {
                const leads = await fetch('http://localhost:3000/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        name,
                        phone,
                        travel_time,
                        referralCode
                    })
                })
                if (!leads.ok) {
                    console.error(leads)
                    throw new Error(
                        'Error al enviar los datos a la API de leads'
                    )
                }
            }

            return 'success'
        }
    })
}
