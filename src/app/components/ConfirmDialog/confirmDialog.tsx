import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { createRoot } from "react-dom/client"

export async function openConfirmDialog(msg: string): Promise<boolean> {
    let body = document.querySelector("body")

    if (!body) throw new Error("Body não encontrado!")

    let container = document.createElement("div")
    
    body.appendChild(container)

    let root = createRoot(container)

    let result = await new Promise<boolean>((resolve) => {
        root.render(<ConfirmDialog msg={msg} resolve={resolve} />)
    })

    root.unmount()

    return result
}

function ConfirmDialog(props: ConfirmDialogProps) {

    let buttonClass = "w-1/3 rounded-lg p-1"

    return (
        <Dialog open={true}>
            <DialogTitle>Confirmar</DialogTitle>
            <DialogContent>
                {props.msg}
                <div className="w-full flex justify-between mt-4">
                    <Button className={buttonClass} style={{ backgroundColor: "#18191c", color: "#D9D9D9", borderColor: "#D9D9D9" }} onClick={() => props.resolve(true)}>Confirmar</Button>
                    <Button className={buttonClass} style={{ backgroundColor: "#D6D6D6", color: "black" }} onClick={() => props.resolve(false)} >Cancelar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface ConfirmDialogProps {
    msg: string
    resolve: (result: boolean) => void
}