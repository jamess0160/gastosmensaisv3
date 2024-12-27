import { Select as MuiSelect, MenuItem, SelectProps as MuiSelectProps } from '@mui/material';
import { HTMLAttributes } from "react";
import { UseFormReturn } from 'react-hook-form';

export function Select(props: SelectProps) {

    return (
        <div className="relative w-10/12 h-8 text-white mix-blend-lighten">
            <legend
                {...props.labelProps}
                className={"absolute left-4 -top-3 bg-default z-10" + (props.labelProps?.className || "")}
            >
                {props.label}

            </legend>
            <MuiSelect
                value={props.form.watch(props.formProp)}
                onChange={(e) => {
                    return props.form.setValue(props.formProp, e.target.value)
                }}
                {...props.selectProps}
                className={`
                    w-full box-border pl-4 outline-none
                    bg-default text-xs h-full rounded-xl
                    border border-solid border-white text-white
                    focus:border-gray-500
                `}
            >
                {
                    props.selectItems.map((item) => {
                        return <MenuItem value={item.key} key={item.key} className='text-white' >{item.text}</MenuItem>
                    })
                }
            </MuiSelect>
        </div>
    )
}

interface SelectProps {
    label: string
    form: UseFormReturn<any, any, any>
    formProp: string
    labelProps?: HTMLAttributes<HTMLLegendElement>
    selectProps?: MuiSelectProps
    selectItems: SelectItem[]
}

export interface SelectItem {
    key: number | string
    text: string
}