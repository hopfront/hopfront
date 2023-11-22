import {useMatomo} from "@jonkoops/matomo-tracker-react";
import {getHopFrontVersion} from "@/app/lib/openapi/utils";
import {TrackPageViewParams} from "@jonkoops/matomo-tracker/src/types";
import {useEffect, useRef} from "react";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";

type EventCategory = "browse" | "dashboard" | "dashboard-panel" | "onboarding" | "operation" | "settings";

export interface RegisterEventParams {
    category: EventCategory
    action: string
    name?: string
}

export const useAnalytics = () => {
    const {trackEvent, trackPageView} = useMatomo();
    const {data: properties} = useInstanceProperties();
    const pageViewStateRef = useRef<Record<string, boolean>>({});

    const usePageView = (documentTitle: string) => {
        useEffect(() => {
            if (!pageViewStateRef.current[documentTitle]) {
                if (properties?.instanceId) {
                    trackPageView({
                        documentTitle: documentTitle,
                        customDimensions: [
                            {
                                id: 1,
                                value: properties.instanceId
                            },
                            {
                                id: 2,
                                value: getHopFrontVersion(),
                            }
                        ],
                    } as TrackPageViewParams);

                    pageViewStateRef.current[documentTitle] = true;
                }
            }
        }, [documentTitle]);
    };

    const registerEvent = (params: RegisterEventParams) => {
        if (properties?.instanceId) {
            trackEvent({
                category: params.category,
                name: params.name,
                action: params.action,
                customDimensions: [
                    {
                        id: 3,
                        value: properties.instanceId
                    },
                    {
                        id: 4,
                        value: getHopFrontVersion(),
                    }
                ]
            });
        }
    };

    return {
        usePageView,
        registerEvent
    }
}



