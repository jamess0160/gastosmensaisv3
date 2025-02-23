import { Clear } from '@mui/icons-material';
import { Select as MuiSelect, MenuItem, SelectProps as MuiSelectProps, Checkbox, SelectChangeEvent, InputAdornment, IconButton } from '@mui/material';
import { HTMLAttributes, useState } from "react";
import { UseFormReturn } from 'react-hook-form';

export function Select(props: SelectProps) {
    let [open, setOpen] = useState(false);

    let defaultValue = props.form.getValues()[props.formProp] ?? ""

    if (props.selectProps?.multiple && Array.isArray(defaultValue) === false) {
        defaultValue = []
    }

    let value: string | string[] = props.form.watch(props.formProp, defaultValue)

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

    const handleMenuItemClick = (event: React.MouseEvent, itemKey: string) => {
        if (event.target instanceof HTMLInputElement) {
            return;
        }

        setOpen(false);
        props.form.setValue(props.formProp, itemKey);
    };

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
        <div className="relative w-full h-8 text-white mix-blend-lighten">
            <legend
                {...props.labelProps}
                className={"absolute left-4 -top-3 bg-default z-10" + (props.labelProps?.className || "")}
            >
                {props.label}

            </legend>
            <MuiSelect
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                onChange={onChange}
                className={selectClasses}
                MenuProps={MenuProps}
                renderValue={renderValue}
                endAdornment={
                    (Boolean(value) && value.length) ? (
                        <InputAdornment sx={{ position: "absolute", right: 27 }} position="end">
                            <IconButton
                                onClick={() => {
                                    props.form.setValue(props.formProp, props.selectProps?.multiple ? [] : undefined)
                                }}
                            >
                                <Clear color='primary' />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }
                {...props.selectProps}
            >
                {
                    props.selectItems.map((item) => {

                        if (props.selectProps?.multiple && Array.isArray(value)) {
                            return (
                                <MenuItem
                                    value={item.key}
                                    key={item.key}
                                    className='text-white'
                                    onClick={(event) => handleMenuItemClick(event, item.key)}
                                >
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