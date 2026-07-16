export const getGeoInfo = async (request: Request) => {
    const headers = request.headers

    // Vercel headers (producción)
    const countryCode = headers.get('x-vercel-ip-country')
    const city = headers.get('x-vercel-ip-city')
    const region = headers.get('x-vercel-ip-region')
    const ip = headers.get('x-forwarded-for') ?? headers.get('x-real-ip')

    if (countryCode) {
        return { countryCode, city, region, ip }
    }

    // Fallback para desarrollo local
    if (import.meta.env.DEV) {
        try {
            const res = await fetch('https://ipapi.co/json/')
            const data = await res.json()
            return {
                countryCode: data.country_code ?? null,
                city: data.city ?? null,
                region: data.region ?? null,
                ip: data.ip ?? null
            }
        } catch {
            return { countryCode: null, city: null, region: null, ip: null }
        }
    }

    return { countryCode: null, city: null, region: null, ip: null }
}

// Mantener función para uso en cliente (Form.astro)
export const getCountryCode = async () => {
    try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        return data.country_code ?? null
    } catch {
        return null
    }
}
