import { createRoot } from "react-dom/client"

export function renderComponent(component: JSX.Element) {
    let body = document.querySelector("body")

    if (!body) throw new Error("Body não encontrado!")

    let container = document.createElement("div")

    body.appendChild(container)

    let root = createRoot(container)

    root.render(component)

    return () => {
        root.unmount()
    }
}