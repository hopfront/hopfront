import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis, YAxis
} from "recharts";
import {extendTheme, useColorScheme} from "@mui/joy/styles";
import {paletteKeyToColorFromJoyTheme} from "@/app/dashboards/[dashboardId]/components/chart/utils";
import React from "react";
import {LoadingResponsiveContainer} from "@/app/dashboards/[dashboardId]/components/LoadingResponsiveContainer";
import {LineSeriesProperties} from "@/app/lib/model/chart/LineSeriesProperties";
import {ChartOptions} from "@/app/lib/model/chart/ChartOptions";
import {ChartDataConfigXAxis} from "@/app/lib/model/chart/ChartDataConfig";
import {ChartSeries} from "@/app/lib/model/chart/ChartSeries";
import {ScatterSeriesProperties} from "@/app/lib/model/chart/ScatterSeriesProperties";
import {Mode} from "@mui/system/cssVars/useCurrentColorScheme";

export interface ChartProps {
    data: any[]
    options: ChartOptions
    xAxes: ChartDataConfigXAxis[]
    series: ChartSeries[]
    loading?: boolean
}

const theme = extendTheme();

const seriesComponent = (series: ChartSeries, mode: Mode | undefined) => {
    const color = paletteKeyToColorFromJoyTheme(series.paletteKey, theme, mode);

    switch (series.type) {
        case "line": {
            return <Line
                key={'line-' + series.dataKey}
                dataKey={series.dataKey}
                type="monotone"
                unit={series.unit}
                dot={series.properties && (series.properties as LineSeriesProperties).dot}
                isAnimationActive={series.properties?.isAnimationActive}
                stroke={color}
                color={color}/>;
        }
        case "area":
            return <Area
                key={'area-' + series.dataKey}
                dataKey={series.dataKey}
                type="monotone"
                unit={series.unit}
                isAnimationActive={series.properties?.isAnimationActive}
                fill={color}
                stroke={color}/>
        case "bar":
            return <Bar
                key={'bar-' + series.dataKey}
                dataKey={series.dataKey}
                unit={series.unit}
                isAnimationActive={series.properties?.isAnimationActive}
                fill={color}/>;
        case "scatter":
            return <Scatter
                key={'scatter-' + series.dataKey}
                dataKey={series.dataKey}
                isAnimationActive={series.properties?.isAnimationActive}
                shape={series.properties && (series.properties as ScatterSeriesProperties).shape}
                fill={color}/>
        default:
            return <></>
    }
}

export const Chart = ({data, loading = false, options, xAxes, series}: ChartProps) => {
    const {mode} = useColorScheme();

    if (loading) {
        return (
            <LoadingResponsiveContainer height={options.height}/>
        );
    }

    const seriesComponents = series.map(oneSeries => seriesComponent(oneSeries, mode));

    return (
        <ResponsiveContainer width="100%" height={options.height}>
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="5 5" vertical={false}/>
                {options.showLegend && <Legend/>}
                {options.showTooltip && <Tooltip/>}
                {options.showYAxis && series.map(series => <YAxis key={'y-' + series.dataKey} unit={series.unit}/>)}
                {options.showXAxis && (xAxes.length > 0
                    ? xAxes.map(xAxis => <XAxis key={'x-' + xAxis.dataKey} dataKey={xAxis.dataKey}/>)
                    : <XAxis/>)}
                {seriesComponents}
            </ComposedChart>
        </ResponsiveContainer>
    );
}