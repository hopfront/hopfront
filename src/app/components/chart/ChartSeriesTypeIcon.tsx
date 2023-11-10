import {
    BarChartRounded,
    ScatterPlot, ShowChartRounded,
    StackedLineChartRounded
} from "@mui/icons-material";
import {paletteKeyToColorFromMaterialTheme} from "@/app/dashboards/[dashboardId]/components/chart/utils";
import {Theme} from "@mui/material";
import {ChartSeriesType} from "@/app/lib/model/chart/ChartSeries";

export interface ChartSeriesTypeIconProps {
    chartSeriesType: ChartSeriesType
    paletteKey?: string
}

export const ChartSeriesTypeIcon = ({chartSeriesType, paletteKey}: ChartSeriesTypeIconProps) => {
    const sx = (theme: Theme) => {
        if (!paletteKey) {
            return {};
        }

        return {
            color: paletteKeyToColorFromMaterialTheme(paletteKey, theme),
        };
    };


    switch (chartSeriesType) {
        case "bar":
            return <BarChartRounded sx={sx}/>;
        case "area":
            return <StackedLineChartRounded sx={sx}/>;
        case "line":
            return <ShowChartRounded sx={sx}/>;
        case "scatter":
            return <ScatterPlot sx={sx}/>;
        default:
            return <ShowChartRounded sx={sx}/>;
    }
}