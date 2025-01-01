import { InfoDialog } from "./sections/infoDialog";
import { ConfirmDialog } from "./sections/confirmDialog";
import { ErrorDialog } from "./sections/errorDialog";

class Dialogs {
    public readonly Info = new InfoDialog()
    public readonly Confirm = new ConfirmDialog()
    public readonly Error = new ErrorDialog()
}

export const dialogs = new Dialogs()