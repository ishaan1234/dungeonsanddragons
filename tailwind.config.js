/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
    	extend: {
    		colors: {
    			primary: {
    				'50': '#f5f3ff',
    				'100': '#ede9fe',
    				'200': '#ddd6fe',
    				'300': '#c4b5fd',
    				'400': '#a78bfa',
    				'500': '#8b5cf6',
    				'600': '#7c3aed',
    				'700': '#6d28d9',
    				'800': '#5b21b6',
    				'900': '#4c1d95',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			gold: {
    				'50': '#fffbeb',
    				'100': '#fef3c7',
    				'200': '#fde68a',
    				'300': '#fcd34d',
    				'400': '#fbbf24',
    				'500': '#f59e0b',
    				'600': '#d97706',
    				'700': '#b45309',
    				'800': '#92400e',
    				'900': '#78350f'
    			},
    			dark: {
    				'50': '#f8fafc',
    				'100': '#f1f5f9',
    				'200': '#45456a',
    				'300': '#35354a',
    				'400': '#252535',
    				'500': '#1a1a25',
    				'600': '#12121a',
    				'700': '#0a0a0f'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontFamily: {
    			display: [
    				'Cinzel',
    				'serif'
    			],
    			body: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			accent: [
    				'Crimson Text',
    				'serif'
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
