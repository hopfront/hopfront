import {LineSeriesProperties} from "@/app/lib/model/chart/LineSeriesProperties";
import {AreaSeriesProperties} from "@/app/lib/model/chart/AreaSeriesProperties";
import {BarSeriesProperties} from "@/app/lib/model/chart/BarSeriesProperties";
import {ScatterSeriesProperties} from "@/app/lib/model/chart/ScatterSeriesProperties";

export type ChartSeriesType = "area" | "bar" | "line" | "scatter"

export interface ChartSeries {
    type: ChartSeriesType
    paletteKey: string
    dataKey: string;
    unit?: string
    valueMultiplier?: number
    properties?: AreaSeriesProperties | BarSeriesProperties | LineSeriesProperties | ScatterSeriesProperties
}