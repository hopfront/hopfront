/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
    async redirects() {
        return [
            {
                source: '/',
                destination: '/browse',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig
