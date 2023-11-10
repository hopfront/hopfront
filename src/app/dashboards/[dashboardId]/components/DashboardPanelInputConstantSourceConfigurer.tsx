import React, {FormEvent} from "react";
import {Input} from "@mui/joy";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";

export interface DashboardPanelInputConstantSourceConfigurerProps {
    data: DashboardPanelInputSourceConfigDataConstant
    onChange: (data: DashboardPanelInputSourceConfigDataConstant) => void
}

export const DashboardPanelInputConstantSourceConfigurer = ({data, onChange}: DashboardPanelInputConstantSourceConfigurerProps) => {
    const onTextChange = (e: FormEvent<HTMLInputElement>) => {
        onChange({
            value: e.currentTarget.value
        });
    };

    return (
        <>
            <Input type="text" value={data.value} onChange={onTextChange}></Input>
        </>
    );
}