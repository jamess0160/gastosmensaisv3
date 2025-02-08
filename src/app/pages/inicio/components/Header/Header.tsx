import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Settings, Logout, DisplaySettings, Receipt, AccountBalance, Key } from '@mui/icons-material'
import styles from './Header.module.css'
import Link from "next/link";
import { clientUtilsUseCases } from "@/useCases/Utils/ClientUtilsUseCases/ClientUtilsUseCases";
import React, { useState } from "react";
import { ChangePassword } from "./sections/changePassword";

interface HeaderProps {
    month: number
    year: number
    userName: string
}

export default function Header({ month, year, userName }: HeaderProps) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [passOpen, setPassOpen] = useState(false)

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
                    <MenuItem className="flex flex-row no-underline text-black" onClick={() => setPassOpen(true)}>
                        <ListItemIcon>
                            <Key />
                        </ListItemIcon>
                        <ListItemText>Trocar senha</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                        <ListItemIcon>
                            <Logout fontSize="medium" />
                        </ListItemIcon>
                        <ListItemText>LogOut</ListItemText>
                    </MenuItem>
                    <Link href={"/pages/relatorios/gastos"} className="flex flex-row no-underline text-black">
                        <MenuItem>
                            <ListItemIcon>
                                <AccountBalance fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Relatório de gastos</ListItemText>
                        </MenuItem>
                    </Link>
                    <Link href={"/pages/relatorios/notas"} className="flex flex-row no-underline text-black">
                        <MenuItem>
                            <ListItemIcon>
                                <Receipt fontSize="medium" />
                            </ListItemIcon>
                            <ListItemText>Relatório de notas</ListItemText>
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

            <ChangePassword open={passOpen} setOpen={setPassOpen} />
        </div>
    )
}