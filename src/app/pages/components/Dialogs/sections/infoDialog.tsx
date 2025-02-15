'use client';
import { renderComponent } from "@/useCases/Utils/ClientUtilsUseCases/sections/renderComponent";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material"

export class InfoDialog {

    public async show(msg: string) {
        let unmount = () => { }

        await new Promise<boolean>((resolve) => {
            unmount = renderComponent(<this.Dialog msg={msg} resolve={resolve} />)
        })

        unmount()
    }

    private Dialog(props: InfoDialogProps) {

        let buttonClass = "w-fit rounded-lg p-2 px-4"

        return (
            <Dialog open={true} PaperProps={{ className: "w-1/5 max-md:w-4/5 border-2 border-solid border-blue-500 bg-default text-white" }}>
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