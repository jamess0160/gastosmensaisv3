'use client';
import { createTheme } from '@mui/material/styles';
import { Lexend } from "next/font/google";

const font = Lexend({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff"
        },
        background: {
            default: "#1e1f22",
            paper: "#1e1f22",
        },

    },
    typography: {
        fontFamily: font.style.fontFamily,
    },
});