export const getCountryCode = async () => {
    try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        const code = data.country_code
        return code
    } catch (error) {
        return null
    }
}
