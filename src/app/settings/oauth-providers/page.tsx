'use client';

import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";

export default function Page() {
    const {usePageView} = useAnalytics();

    usePageView("oauth-providers-page");


    return (
        <>

        </>
    );
}
