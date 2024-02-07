'use client';
import { createTheme } from '@mui/material/styles';
import { Inter } from "next/font/google";

const inter = Inter({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff"
        }
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
});