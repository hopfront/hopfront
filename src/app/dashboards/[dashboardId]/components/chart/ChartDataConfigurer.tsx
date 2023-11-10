import React, {useState} from "react";
import {
    getSchemaPropertySchemaRef
} from "@/app/lib/openapi/utils";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {ChartDataXAxesConfigurer} from "@/app/dashboards/[dashboardId]/components/chart/ChartDataXAxesConfigurer";
import {
    ChartDataSeriesListConfigurer
} from "@/app/dashboards/[dashboardId]/components/chart/ChartDataSeriesListConfigurer";
import {
    ResponseSchemaProperty
} from "@/app/components/input/ResponseSchemaPropertySelector";
import {Box} from "@mui/joy";
import {ChartDataConfig} from "@/app/lib/model/chart/ChartDataConfig";

export interface ChartDataConfigurerProps {
    responseSchemaProperty: ResponseSchemaProperty
    defaultChartDataConfig?: ChartDataConfig
    onChartDataConfigured: (chartDataConfig: ChartDataConfig) => void
    apiSpec: ApiSpec
}

export const ChartDataConfigurer = ({
                                        responseSchemaProperty,
                                        defaultChartDataConfig,
                                        onChartDataConfigured,
                                        apiSpec
                                    }: ChartDataConfigurerProps) => {

    const [xAxes, setXAxes] = useState(defaultChartDataConfig?.xAxes || []);
    const [series, setSeries] = useState(defaultChartDataConfig?.series);

    const schemaRef = getSchemaPropertySchemaRef(responseSchemaProperty, apiSpec);

    return (
        <>
            {schemaRef && <Box sx={{mt: 2}}><ChartDataXAxesConfigurer
                schemaRef={schemaRef}
                xAxes={xAxes}
                onXAxesConfigured={configuredXAxes => {
                    setXAxes(configuredXAxes);
                    onChartDataConfigured({
                        responseSchemaProperty: responseSchemaProperty,
                        xAxes: configuredXAxes,
                        series: series || []
                    })
                }}
                apiSpec={apiSpec}/></Box>}

            {schemaRef && <Box sx={{mt: 2}}><ChartDataSeriesListConfigurer
                schemaRef={schemaRef}
                series={series || []}
                onSeriesConfigured={configuredSeries => {
                    setSeries(configuredSeries);
                    onChartDataConfigured({
                        responseSchemaProperty: responseSchemaProperty,
                        xAxes: xAxes,
                        series: configuredSeries
                    })
                }}
                apiSpec={apiSpec}/></Box>}
        </>
    )
}