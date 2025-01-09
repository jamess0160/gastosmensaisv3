import { Dispatch } from "react"

export function Tabs({ setSelectedCategory, selectedCategory }: TabsProps) {

    let tabs = ["Destinos", "Bancos", "Tipos de gastos", "Categorias de notas"]

    return (
        <div className="flex flex-row w-fit max-md:w-full max-md:flex-col max-md:items-center max-md:!bg-none rounded-t-xl" style={{ background: "linear-gradient(0deg, rgba(49, 51, 56, 0.9) 66.87%, rgba(49, 51, 56, 0.9) 100%)" }}>
            {tabs.map((item, index) => {

                function onInteract() {
                    setSelectedCategory(index)
                }

                let classes = "m-0 px-3 hover:bg-default p-2 max-md:!bg-transparent"

                if (index === 0) {
                    classes += " rounded-tl-xl"
                }

                if (index == tabs.length - 1) {
                    classes += " rounded-tr-xl"
                }

                if (selectedCategory === index) {
                    classes += " bg-default max-md:underline max-md:text-fundoVerde"
                }

                return (
                    <h1
                        key={index}
                        onClick={onInteract}
                        onFocus={onInteract}
                        id={`Category${index.toString()}`}
                        className={classes}
                    >
                        {item}
                    </h1>
                )
            })}
        </div>
    )
}

interface TabsProps {
    setSelectedCategory: Dispatch<number>
    selectedCategory: number
}