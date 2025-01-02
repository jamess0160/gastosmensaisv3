'use client';
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { createRoot } from "react-dom/client"

export class ConfirmDialog {

    public async show(msg: string): Promise<boolean> {
        let body = document.querySelector("body")

        if (!body) throw new Error("Body não encontrado!")

        let container = document.createElement("div")

        body.appendChild(container)

        let root = createRoot(container)

        let result = await new Promise<boolean>((resolve) => {
            root.render(<this.Dialog msg={msg} resolve={resolve} />)
        })

        root.unmount()

        return result
    }

    private Dialog(props: ConfirmDialogProps) {

        let buttonClass = "w-fit rounded-lg p-2 px-4"

        return (
            <Dialog open={true} PaperProps={{ className: "w-1/5 max-md:w-4/5" }}>
                <DialogTitle>Confirmar</DialogTitle>
                <DialogContent>
                    {props.msg}
                    <div className="w-full flex justify-around mt-4">
                        <Button className={buttonClass} style={{ backgroundColor: "#36b37e", color: "white", borderColor: "#D9D9D9" }} onClick={() => props.resolve(true)}>Confirmar</Button>
                        <Button className={buttonClass} style={{ backgroundColor: "#ff5630", color: "white" }} onClick={() => props.resolve(false)} >Cancelar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

interface ConfirmDialogProps {
    msg: string
    resolve: (result: boolean) => void
}