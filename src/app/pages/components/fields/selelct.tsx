import { HTMLAttributes, SelectHTMLAttributes } from "react";

export function Select(props: SelectProps) {

    return (
        <div className="relative w-10/12 h-8 text-white mix-blend-lighten">
            <legend
                {...props.labelProps}
                className={"absolute left-4 -top-3 bg-default" + (props.labelProps?.className || "")}
            >
                {props.label}

            </legend>
            <select
                defaultValue={0}
                {...props.selectProps}
                className={`
                    w-full box-border pl-4 outline-none
                    bg-default text-xs h-full rounded-xl
                    border border-solid border-white text-white
                    focus:border-gray-500
                `}
            >
                <option disabled value={0} />
                {
                    props.selectItems.map((item) => {
                        return <option value={item.key} key={item.key}>{item.text}</option>
                    })
                }
            </select>
        </div>
    )
}

interface SelectProps {
    label: string
    labelProps?: HTMLAttributes<HTMLLegendElement>
    selectProps?: SelectHTMLAttributes<HTMLSelectElement>
    selectItems: SelectItem[]
}

export interface SelectItem {
    key: number | string
    text: string
}