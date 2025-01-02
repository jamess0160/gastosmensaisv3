import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Assessment, Settings, Logout, DisplaySettings } from '@mui/icons-material'
import styles from './Header.module.css'
import Link from "next/link";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases";
import React from "react";

interface HeaderProps {
    month: number
    year: number
    userName: string
}

export default function Header({ month, year, userName }: HeaderProps) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function logOut() {
        location.href = "/pages/logOut"
    }

    return (
        <div className={styles.header}>
            <div className="flex flex-col">

                <IconButton color="primary" size="large" onClick={handleClick}>
                    <Settings fontSize="large" />
                </IconButton>

                <Menu
                    id="basic-menu"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                >
                    <Link href={"/pages/config"} className="flex flex-row no-underline text-black">
                        <MenuItem>
                            <ListItemIcon>
                                <Settings fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Configurações</ListItemText>
                        </MenuItem>
                    </Link>
                    <MenuItem onClick={logOut}>
                        <ListItemIcon>
                            <Logout fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>LogOut</ListItemText>
                    </MenuItem>
                    <Link href={"/pages/relatorios"} className="flex flex-row no-underline text-black">
                        <MenuItem>
                            <ListItemIcon>
                                <Assessment fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Relatório</ListItemText>
                        </MenuItem>
                    </Link>
                    <Link href={"/pages/personalizacao"} className="flex flex-row no-underline text-black">
                        <MenuItem>
                            <ListItemIcon>
                                <DisplaySettings fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Personalização</ListItemText>
                        </MenuItem>
                    </Link>
                </Menu>
            </div>
            <div>
                <div className="m-0 text-4xl text-end">
                    {`${clientUtilsUseCases.months[month]}, ${year}`}
                </div>
                <div className="m-0 text-2xl text-end">
                    {`Olá ${userName}`}
                </div>
            </div>
        </div>
    )
}