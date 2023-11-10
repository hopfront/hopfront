import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationAsyncResponse} from "@/app/dashboards/[dashboardId]/components/DashboardPanelGridItem";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import React, {useEffect, useState} from "react";
import {buildSuccessBodyOrProblem} from "@/app/components/operation/response/utils";
import {ProblemAlert} from "@/app/components/alert/ProblemAlert";
import {ResponseAlert} from "@/app/components/alert/ResponseAlert";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {OpenAPIV3} from "openapi-types";
import {
    getMediaType,
    getReferenceObjectOrUndefined,
    getSchemaPropertySchemaRef,
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {Chart} from "@/app/components/chart/Chart";
import {LoadingResponsiveContainer} from "@/app/dashboards/[dashboardId]/components/LoadingResponsiveContainer";
import {ChartDataConfig} from "@/app/lib/model/chart/ChartDataConfig";
import {DashboardPanelChartConfig} from "@/app/lib/model/dashboard/DashboardPanelChartConfig";
import ResponseObject = OpenAPIV3.ResponseObject;

const getChartDataFromObject = (
    object: any | undefined,
    objectSchema: SchemaOrReference | undefined,
    chartDataConfig: ChartDataConfig,
    apiSpec: ApiSpec): any[] => {

    if (!objectSchema || !object) {
        return [];
    }

    const schemaObject = resolveSchemaFromSchemaOrReference(objectSchema, apiSpec.document);
    const chartDataSchemaRef = getSchemaPropertySchemaRef(chartDataConfig.responseSchemaProperty, apiSpec);

    switch (schemaObject.type) {
        case "array": {
            const arrayItemsSchema = schemaObject.items;
            const arrayItemsSchemaRef = getReferenceObjectOrUndefined(arrayItemsSchema);

            if (arrayItemsSchemaRef) {
                if (arrayItemsSchemaRef.$ref === chartDataSchemaRef) {
                    if (object) {
                        const arrayObject = object as any[];

                        return arrayObject.map(arrayObjectItem => {
                            chartDataConfig.series.forEach(uniqueSeries => {
                                arrayObjectItem[uniqueSeries.dataKey] = arrayObjectItem[uniqueSeries.dataKey] * (uniqueSeries.valueMultiplier || 1);
                            });

                            return arrayObjectItem;
                        });
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }
        case "object": {
            for (const objectPropertyName in schemaObject.properties) {
                const propertySchema = schemaObject.properties[objectPropertyName];

                const chartDataFromProperty = getChartDataFromObject(object[objectPropertyName], propertySchema, chartDataConfig, apiSpec);

                if (chartDataFromProperty.length > 0) {
                    return chartDataFromProperty;
                }
            }

            return [];
        }
        default: {
            return [];
        }
    }
}

export interface DashboardPanelChartContentProps {
    panel: DashboardPanel
    operation: StandaloneOperation
    response: OperationAsyncResponse
    apiContext: ApiContext
}

const CHART_HEIGHT = 200;

export const DashboardPanelChartContent = ({
                                               panel,
                                               operation,
                                               response: operationResponse,
                                               apiContext
                                           }: DashboardPanelChartContentProps) => {
    const [responseText, setResponseText] = useState<string | undefined>();

    const response = operationResponse.response;

    useEffect(() => {
        if (!response) {
            return;
        }

        if (!response.bodyUsed) {
            response.text().then(text => setResponseText(text));
        }
    }, [response, responseText]);

    if (!response || operationResponse.loading) {
        return <LoadingResponsiveContainer height={CHART_HEIGHT}/>;
    }

    const {body, problem} = buildSuccessBodyOrProblem(response.status, responseText);

    if (problem) {
        return <ProblemAlert problem={problem} onClose={() => setResponseText(undefined)}/>;
    }

    const contentType = response.headers.get('content-type');

    if (!contentType) {
        return <div>no content type</div>;
    }

    const openAPIResponse = operation.operation.responses[response.status];

    if (!openAPIResponse) {
        return <ResponseAlert response={response}/>;
    }

    const openAPIResponseObject = openAPIResponse as ResponseObject;

    const mediaType = getMediaType(openAPIResponseObject, contentType);

    if (!mediaType || !mediaType.schema) {
        return <ErrorAlert error={new Error("Couldn't find schema for response object")}/>
    }

    const panelChartConfig = panel.config as DashboardPanelChartConfig;
    const chartDataConfig = panelChartConfig.chartDataConfig;

    if (!chartDataConfig) {
        return <WarningAlert title="This Chart panel is not configured yet."/>
    }

    const data = getChartDataFromObject(body, mediaType.schema, chartDataConfig, apiContext.apiSpec);

    return (
        <Chart
            data={data}
            options={{
                showLegend: true,
                showTooltip: true,
                showXAxis: true,
                showYAxis: true,
                height: CHART_HEIGHT
            }}
            xAxes={chartDataConfig.xAxes}
            series={chartDataConfig.series}
            loading={operationResponse.loading}/>
    );
}