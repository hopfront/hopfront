import {Skeleton} from "@mui/joy";
import {ResponsiveContainer} from "recharts";
import React from "react";

export interface LoadingResponsiveContainer {
    height: number
}

export const LoadingResponsiveContainer = ({height}: LoadingResponsiveContainer) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <Skeleton>
                <img
                    alt=""
                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                />
            </Skeleton>
        </ResponsiveContainer>
    );
}