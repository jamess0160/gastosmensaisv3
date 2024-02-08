import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Lexend } from "next/font/google";

const font = Lexend({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: "Gastos Mensais V3",
	description: "Generated by create next app",
};

type RootLayoutParams = Readonly<{ children: React.ReactNode; }>

export default function RootLayout({ children }: RootLayoutParams) {
	return (
		<html lang="en">
			<body className={font.className}>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<ThemeProvider theme={theme}>
						{children}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
