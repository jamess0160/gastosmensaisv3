import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { createRoot } from "react-dom/client"

export class ErrorDialog {

    public async show(msg: string, title?: string): Promise<boolean> {
        let body = document.querySelector("body")

        if (!body) throw new Error("Body não encontrado!")

        let container = document.createElement("div")

        body.appendChild(container)

        let root = createRoot(container)

        let result = await new Promise<boolean>((resolve) => {
            root.render(<this.Dialog msg={msg} resolve={resolve} title={title} />)
        })

        root.unmount()

        return result
    }

    private Dialog(props: ConfirmDialogProps) {

        let buttonClass = "w-fit rounded-lg p-2 px-4"

        return (
            <Dialog open={true} PaperProps={{ className: "w-1/5 border-2 border-solid border-red-600" }}>
                <DialogTitle className="text-red-600">{props.title || "Ocorreu um erro!"}</DialogTitle>
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

interface ConfirmDialogProps {
    msg: string
    title?: string
    resolve: (result: boolean) => void
}