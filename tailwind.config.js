/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                gold: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#45456a',
                    300: '#35354a',
                    400: '#252535',
                    500: '#1a1a25',
                    600: '#12121a',
                    700: '#0a0a0f',
                }
            },
            fontFamily: {
                display: ['Cinzel', 'serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                accent: ['Crimson Text', 'serif'],
            },
        },
    },
    plugins: [],
};
