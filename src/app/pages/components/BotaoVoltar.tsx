'use client';
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function BotaoVoltar() {
    let pathName = usePathname()

    if (pathName.includes("/pages/inicio")) {
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