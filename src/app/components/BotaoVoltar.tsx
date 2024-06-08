'use client';
import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material"
import { usePathname, useRouter } from "next/navigation";

export default function BotaoVoltar() {
    let router = useRouter()
    let pathName = usePathname()

    if (pathName.includes("/inicio")) {
        return
    }

    return (
        <IconButton className="fixed top-0" onClick={() => router.back()} color="primary" size="large">
            <ArrowBack fontSize="large" />
        </IconButton>
    )
}