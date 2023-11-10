import {ResponseSchemaProperty} from "@/app/components/input/ResponseSchemaPropertySelector";
import {ChartSeries} from "@/app/lib/model/chart/ChartSeries";

export interface ChartDataConfig {
    responseSchemaProperty: ResponseSchemaProperty
    xAxes: ChartDataConfigXAxis[]
    series: ChartSeries[]
}

export interface ChartDataConfigXAxis {
    dataKey: string
    unit?: string
}