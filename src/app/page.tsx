import { serverUtilsUseCases } from "@/useCases/Utils/ServerUtilsUseCases/ServerUtilsUseCases";
import { redirect } from "next/navigation";

export default async function Page() {

    let session = await serverUtilsUseCases.Cookies.getSession()

    if (session?.IdUser) {
        redirect("/pages/inicio")
    } else {
        redirect("/pages/login")
    }
}