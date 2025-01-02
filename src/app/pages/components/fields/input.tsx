import { HTMLAttributes, InputHTMLAttributes } from "react";

export function Input(props: InputProps) {

    let label = props.label ? (
        <legend
            {...props.labelProps}
            className={"absolute left-4 -top-3 bg-default" + (props.labelProps?.className || "")}
        >
            {props.label}
        </legend>
    ) : null

    return (
        <div className="relative w-full h-8 text-white mix-blend-lighten">
            {label}
            <input
                {...props.inputProps}
                className={`
                    w-full box-border pl-4 outline-none
                    bg-default text-xs h-full rounded-xl
                    border border-solid border-white text-white
                    focus:border-gray-500 ${props.inputProps?.className || ""}
                `}
            ></input>
        </div>
    )
}

interface InputProps {
    label?: string
    labelProps?: HTMLAttributes<HTMLLegendElement>
    inputProps?: InputHTMLAttributes<HTMLInputElement>
}