import { Select as MuiSelect, MenuItem, SelectProps as MuiSelectProps, Checkbox, SelectChangeEvent } from '@mui/material';
import { HTMLAttributes } from "react";
import { UseFormReturn } from 'react-hook-form';

export function Select(props: SelectProps) {

    let value: string | string[] = props.form.watch(props.formProp, props.selectProps?.multiple ? [] : "")

    const selectClasses = `
        w-full box-border outline-none
        bg-default text-xs h-full rounded-xl
        border border-solid border-white text-white
        focus:border-gray-500 AppSelect
    `

    const onChange = (e: SelectChangeEvent<any>) => {
        return props.form.setValue(props.formProp, e.target.value)
    }

    const MenuProps = {
        MenuListProps: {
            className: "bg-default"
        }
    }

    const renderValue = () => {

        if (Array.isArray(value) === false) {
            let selectedItem = props.selectItems.find((item) => item.key === value)
            return selectedItem?.text
        }

        return value
            .map((itemValue) => {
                let selectedItem = props.selectItems.find((item) => item.key === itemValue)
                return selectedItem?.text
            })
            .join(", ")
    }

    return (
        <div className="relative w-10/12 h-8 text-white mix-blend-lighten">
            <legend
                {...props.labelProps}
                className={"absolute left-4 -top-3 bg-default z-10" + (props.labelProps?.className || "")}
            >
                {props.label}

            </legend>
            <MuiSelect
                value={value}
                onChange={onChange}
                className={selectClasses}
                MenuProps={MenuProps}
                renderValue={renderValue}
                {...props.selectProps}
            >
                {
                    props.selectItems.map((item) => {

                        if (props.selectProps?.multiple && Array.isArray(value)) {
                            return (
                                <MenuItem value={item.key} key={item.key} className='text-white' >
                                    <Checkbox checked={value.includes(item.key)} />
                                    {item.text}
                                </MenuItem>
                            )
                        }

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
    key: string
    text: string
}