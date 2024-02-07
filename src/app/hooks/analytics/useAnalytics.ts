import {getHopFrontVersion} from "@/app/lib/openapi/utils";
import {useEffect, useRef} from "react";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";
import Plausible from "plausible-tracker";

export interface RegisterEventParams {
    name: string
    props?: { readonly [propName: string]: string | number | boolean }
}

export const useAnalytics = () => {
    // We keep the matomo env var to be backward compatible.
    const telemetryDisabled = process.env.NEXT_PUBLIC_TELEMETRY_DISABLED === '1' || process.env.NEXT_PUBLIC_MATOMO_DISABLED === 'true';

    const instanceUrl = new URL(window.location.href);
    const eventApiHost = instanceUrl.protocol + '//' + instanceUrl.host;

    const {trackPageview, trackEvent} = Plausible({
        apiHost: eventApiHost,
        domain: 'app.hopfront.com',
        trackLocalhost: true
    })

    const {data: properties} = useInstanceProperties();
    const pageViewStateRef = useRef<Record<string, boolean>>({});

    const usePageView = (path: string) => {
        const url = new URL(window.location.href);

        useEffect(() => {
            if (telemetryDisabled) {
                return;
            }

            if (!pageViewStateRef.current[path]) {
                if (properties?.instanceId) {
                    const pageUrl = url.hostname + path;
                    trackPageview({
                        url: pageUrl,
                    });
                    pageViewStateRef.current[path] = true;
                }
            }
        }, [path, url.hostname]);
    };

    const registerEvent = (params: RegisterEventParams) => {
        if (telemetryDisabled) {
            return;
        }

        if (properties?.instanceId) {
            trackEvent(params.name, {
                props: {
                    ...params.props,
                    instanceId: properties.instanceId,
                    appVersion: getHopFrontVersion(),
                }
            });
        }
    };

    return {
        usePageView,
        registerEvent
    }
}



