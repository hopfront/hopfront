import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import {ForeignKeyFormControlInput} from "@/app/components/input/ForeignKeyFormControlInput";
import React, {useState} from "react";

import {Edit} from "@mui/icons-material";

export interface ForeignKeyInputPreviewProps {
    inputLabel?: string
    required?: boolean
    foreignKeys: ForeignKey[]
    foreignKeyIcon?: React.ReactNode
}

export const ForeignKeyInputPreview = ({
                                           inputLabel,
                                           required,
                                           foreignKeys,
                                           foreignKeyIcon = <Edit/>
                                       }: ForeignKeyInputPreviewProps) => {

    const [foreignKeyValue, setForeignKeyValue] = useState();

    return (
        <>
            <ForeignKeyFormControlInput
                inputLabel={inputLabel}
                required={required}
                updatableValue={{
                    value: foreignKeyValue,
                    onValueUpdate: value => {
                        setForeignKeyValue(value);
                    }
                }}
                foreignKeys={foreignKeys}
                icon={foreignKeyIcon}/>
        </>
    );
}