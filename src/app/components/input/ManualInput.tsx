import { Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem, SvgIcon } from "@mui/joy";
import Input from "@mui/joy/Input";
import React, { HTMLInputTypeAttribute, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { InputMenu } from "@/app/components/input/InputMenu";

export type ManualInputValueType = string | ReadonlyArray<string> | number | undefined;

export interface ManualInputProps {
    type: HTMLInputTypeAttribute
    onChange: (value: ManualInputValueType) => void
    defaultValue?: ManualInputValueType
    placeholder?: string | undefined
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    debounceMillis?: number
    menu?: InputMenu
    endDecorator?: React.ReactNode
    min?: number
    max?: number
    sx?: {}
}

export const ManualInput = ({
    type,
    defaultValue,
    placeholder,
    onChange,
    required,
    disabled,
    debounceMillis = 0,
    readOnly,
    menu,
    endDecorator,
    min,
    max,
    sx
}: ManualInputProps) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const onInputChange = useDebouncedCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        debounceMillis
    );

    return (
        <>
            <Input
                endDecorator={endDecorator ? endDecorator : menu &&
                    <Dropdown>
                        <MenuButton
                            slots={{ root: IconButton }}
                        >
                            <SvgIcon slots={{ root: menu.icon }} />
                        </MenuButton>
                        <Menu sx={{ zIndex: 'calc(var(--joy-zIndex-modal) + 1)' }}
                            placement="bottom-start">
                            {menu.items.map(menuItem => (
                                <MenuItem
                                    key={menuItem.text}
                                    onClick={menuItem.onClick}>
                                    {menuItem.icon &&
                                        <ListItemDecorator>
                                            <SvgIcon slots={{ root: menuItem.icon }} />
                                        </ListItemDecorator>}
                                    {menuItem.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Dropdown>}
                sx={{
                    ...sx,
                    "--Input-placeholderOpacity": 0.2
                }}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                disabled={disabled || readOnly}
                onChange={onInputChange}
                slotProps={{
                    input: {
                        ref: inputRef,
                        min: min,
                        max: max,
                    }
                }}
                readOnly={readOnly} />
        </>
    )
}