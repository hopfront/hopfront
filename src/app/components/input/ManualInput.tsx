import {Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem, SvgIcon} from "@mui/joy";
import Input from "@mui/joy/Input";
import React, {HTMLInputTypeAttribute, useRef, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {InputMenu} from "@/app/components/input/InputMenu";

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
    const [showMenuIcon, setShowMenuIcon] = useState(false);

    const onInputChange = useDebouncedCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        debounceMillis
    );

    return (
        <>
            <Input
                onMouseOver={() => setShowMenuIcon(true)}
                onMouseLeave={() => setShowMenuIcon(false)}
                onFocus={() => setShowMenuIcon(true)}
                onBlur={() => setShowMenuIcon(false)}
                endDecorator={endDecorator ? endDecorator : (showMenuIcon && menu) && <Dropdown>
                    <MenuButton
                        tabIndex={-1}
                        slots={{root: IconButton}}
                        slotProps={{root: {color: 'neutral'}}}
                    >
                        <SvgIcon slots={{root: menu.icon}}></SvgIcon>
                    </MenuButton>
                    <Menu placement="bottom-start">
                        {menu.items.map(menuItem => (
                            <MenuItem key={menuItem.text} onClick={menuItem.onClick}>
                                {menuItem.icon && <ListItemDecorator>
                                    <SvgIcon slots={{root: menuItem.icon}}></SvgIcon>
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
                readOnly={readOnly}/>
        </>
    )
}