import {useMatomo} from "@jonkoops/matomo-tracker-react";
import {getHopFrontVersion} from "@/app/lib/openapi/utils";
import {InstanceProperties} from "@/app/lib/model/InstanceProperties";
import {TrackPageViewParams} from "@jonkoops/matomo-tracker/src/types";
import {useEffect, useRef} from "react";

type EventCategory = "browse" | "dashboard" | "dashboard-panel" | "onboarding" | "operation" | "settings";

const HOPFRONT_CONFIG_INSTANCE_KEY = 'hopfront.config.instance';

const getInstanceProperties = async (): Promise<InstanceProperties> => {
    const instanceConfigStringCache = localStorage.getItem(HOPFRONT_CONFIG_INSTANCE_KEY);

    if (instanceConfigStringCache) {
        return Promise.resolve(JSON.parse(instanceConfigStringCache));
    } else {
        return fetch('/api/instance/properties')
            .then(response => response.json())
            .then(json => json as InstanceProperties)
            .then(instanceProperties => {
                localStorage.setItem(HOPFRONT_CONFIG_INSTANCE_KEY, JSON.stringify(instanceProperties));
                return instanceProperties;
            });
    }
}

export interface RegisterEventParams {
    category: EventCategory
    action: string
    name?: string
}

export const useAnalytics = () => {
    const {trackEvent, trackPageView} = useMatomo();
    const pageViewStateRef = useRef<Record<string, boolean>>({});

    const usePageView = (documentTitle: string) => {
        useEffect(() => {
            if (!pageViewStateRef.current[documentTitle]) {
                pageViewStateRef.current[documentTitle] = true;

                getInstanceProperties()
                    .then(instanceConfig => {
                        trackPageView({
                            documentTitle: documentTitle,
                            customDimensions: [
                                {
                                    id: 1,
                                    value: instanceConfig.instanceId
                                },
                                {
                                    id: 2,
                                    value: getHopFrontVersion(),
                                }
                            ],
                        } as TrackPageViewParams);
                    });
            }
        }, [documentTitle]);
    };

    const registerEvent = (params: RegisterEventParams) => {
        getInstanceProperties()
            .then(instanceConfig => {
                trackEvent({
                    category: params.category,
                    name: params.name,
                    action: params.action,
                    customDimensions: [
                        {
                            id: 3,
                            value: instanceConfig.instanceId
                        },
                        {
                            id: 4,
                            value: getHopFrontVersion(),
                        }
                    ]
                })
            });
    };

    return {
        usePageView,
        registerEvent
    }
}



