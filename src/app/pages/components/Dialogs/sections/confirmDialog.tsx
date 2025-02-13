'use client';
import { renderComponent } from "@/useCases/Utils/ClientUtilsUseCases/sections/renderComponent";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"

export class ConfirmDialog {

    public async show(msg: string): Promise<boolean> {

        let unmount = () => { }

        let result = await new Promise<boolean>((resolve) => {
            unmount = renderComponent(<this.Dialog msg={msg} resolve={resolve} />)
        })

        unmount()

        return result
    }

    private Dialog(props: ConfirmDialogProps) {

        let buttonClass = "w-fit rounded-lg p-2 px-4"

        return (
            <Dialog open={true} PaperProps={{ className: "w-1/5 max-md:w-4/5 bg-default text-white" }}>
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