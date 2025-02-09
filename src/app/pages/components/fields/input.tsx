import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Dispatch, HTMLAttributes, InputHTMLAttributes, useEffect, useState } from "react";

export function Input(props: InputProps) {

    let [isVisible, setIsVisible] = useState(false)
    let [isFocused, setIsFocused] = useState(false)
    let [inputType, setInputType] = useState<string | undefined>(undefined)

    useEffect(() => {
        setInputType(props.inputProps?.type)
    }, [props.inputProps?.type])

    let label = props.label ? (
        <legend
            {...props.labelProps}
            className={"absolute left-4 -top-3 bg-default" + (props.labelProps?.className || "")}
        >
            {props.label}
        </legend>
    ) : null

    let iconVisible = props.inputProps?.type === "password" && isFocused

    return (
        <div
            className="relative w-full h-8 text-white mix-blend-lighten"
        >
            {label}
            <input
                {...props.inputProps}
                type={inputType}
                className={`
                    w-full box-border pl-4 outline-none
                    bg-default text-xs h-full rounded-xl
                    border border-solid border-white text-white
                    focus:border-gray-500 peer ${props.inputProps?.className || ""}
                `}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
            </input>
            <div hidden={iconVisible ? false : true} className="absolute -top-1 right-2 invisible peer-focus:visible focus-within:visible">
                <IconButton
                    tabIndex={-1}
                    color="primary"
                    onMouseDown={(e) => {
                        e.preventDefault()
                        changeVisibility(setInputType, isVisible, setIsVisible)
                    }}
                >
                    {isVisible ?
                        <VisibilityOff />
                        : <Visibility />
                    }
                </IconButton>
            </div>
        </div>
    )
}

function changeVisibility(setInputType: Dispatch<string>, currentVisibility: boolean, setIsVisible: Dispatch<boolean>) {
    setInputType(currentVisibility ? "password" : "text")
    setIsVisible(!currentVisibility)
}

interface InputProps {
    label?: string
    labelProps?: HTMLAttributes<HTMLLegendElement>
    inputProps?: InputHTMLAttributes<HTMLInputElement>
}