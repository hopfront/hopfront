import {Problem} from "@/app/lib/dto/Problem";

export interface SuccessBodyOrProblem {
    body: any | undefined;
    problem: Problem | undefined;
}

const buildSuccessBody = (responseText: string): SuccessBodyOrProblem => {
    try {
        return {
            body: JSON.parse(responseText),
            problem: undefined,
        };
    } catch (error: any) {
        return {
            body: responseText,
            problem: undefined,
        };
    }
}

const buildProblem = (responseStatus: number, responseText: string): SuccessBodyOrProblem => {
    try {
        const jsonError = JSON.parse(responseText);
        const title = jsonError.hasOwnProperty("title") ? jsonError['title'] : jsonError['message'];
        const detail = jsonError.hasOwnProperty("detail") ? jsonError['detail'] : undefined;

        return {
            body: undefined,
            problem: {
                status: responseStatus,
                title: title,
                detail: detail,
            }
        }
    } catch (error) {
        return {
            body: undefined,
            problem: {
                status: responseStatus,
                title: responseText,
            },
        }
    }
}

export const buildSuccessBodyOrProblem = (responseStatus: number, responseText: string | undefined): SuccessBodyOrProblem => {
    if (!responseText) {
        return {
            body: undefined,
            problem: undefined,
        };
    }

    if (responseStatus >= 400) {
        return buildProblem(responseStatus, responseText);
    } else {
        return buildSuccessBody(responseText);
    }
};
