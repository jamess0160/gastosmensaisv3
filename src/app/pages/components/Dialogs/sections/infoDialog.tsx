'use client';
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { createRoot } from "react-dom/client"

export class InfoDialog {

    public async show(msg: string) {
        let body = document.querySelector("body")

        if (!body) throw new Error("Body não encontrado!")

        let container = document.createElement("div")

        body.appendChild(container)

        let root = createRoot(container)

        await new Promise<boolean>((resolve) => {
            root.render(<this.Dialog msg={msg} resolve={resolve} />)
        })

        root.unmount()
    }

    private Dialog(props: InfoDialogProps) {

        let buttonClass = "w-fit rounded-lg p-2 px-4"

        return (
            <Dialog open={true} PaperProps={{ className: "w-1/5 border-2 border-solid border-blue-500" }}>
                <DialogTitle className="text-blue-500">Informação</DialogTitle>
                <DialogContent>
                    {props.msg}
                    <div className="w-full flex justify-center mt-4">
                        <Button className={buttonClass} style={{ backgroundColor: "#18191c", color: "#D9D9D9", borderColor: "#D9D9D9" }} onClick={() => props.resolve(true)}>Fechar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

interface InfoDialogProps {
    msg: string
    resolve: (result: boolean) => void
}