import { HTMLAttributes, InputHTMLAttributes } from "react";

export function Input(props: InputProps) {

    return (
        <div className="relative w-10/12 h-8 text-white mix-blend-lighten">
            <legend
                {...props.labelProps}
                className={"absolute left-4 -top-3 bg-default" + (props.labelProps?.className || "")}
            >
                {props.label}

            </legend>
            <input
                {...props.inputProps}
                className={`
                    w-full box-content pl-4 outline-none
                    bg-default text-xs h-full rounded-xl
                    border border-solid border-white text-white
                    focus:border-gray-500
                `}
            ></input>
        </div>
    )
}

interface InputProps {
    label: string
    labelProps?: HTMLAttributes<HTMLLegendElement>
    inputProps?: InputHTMLAttributes<HTMLInputElement>
}