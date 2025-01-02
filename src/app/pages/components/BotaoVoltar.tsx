'use client';
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material"
import Link from "next/link";
import { usePathname } from "next/navigation";

const ignoreButton = [
    "/pages/inicio",
    "/pages/logOut",
    "/pages/login",
]

export default function BotaoVoltar() {
    let pathName = usePathname()

    if (ignoreButton.includes(pathName)) {
        return
    }

    return (
        <Link href={"/pages/inicio"}>
            <IconButton className="fixed top-0" color="primary" size="large">
                <ArrowBack fontSize="large" />
            </IconButton>
        </Link>
    )
}