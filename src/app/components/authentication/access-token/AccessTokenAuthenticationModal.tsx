import {getOperationDefaultInputs, getStandaloneOperation} from "@/app/lib/openapi/utils";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import React, {useState} from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {OperationInputForm} from "@/app/components/operation/OperationInputForm";
import {OperationInputs} from "@/app/lib/model/OperationInputs";
import {OperationService} from "@/app/lib/service/OperationService";
import { Typography } from "@mui/joy";
import {buildSuccessBodyOrProblem} from "@/app/components/operation/response/utils";
import {Problem} from "@/app/lib/dto/Problem";
import { ProblemAlert } from "../../alert/ProblemAlert";
import {ApiAuthenticationAccessTokenData} from "@/app/lib/dto/ApiAuthenticationConfig";

export interface AccessTokenAuthenticationModalProps {
    open: boolean
    onClose: () => void
    onAccessToken: (accessToken: string) => void
    apiContext: ApiContext
}

export const AccessTokenAuthenticationModal = ({
                                                   open,
                                                   onClose,
                                                   onAccessToken,
                                                   apiContext
                                               }: AccessTokenAuthenticationModalProps) => {

    const accessTokenConfig = apiContext.config.authenticationConfig?.data as ApiAuthenticationAccessTokenData;

    const operation =
        getStandaloneOperation(accessTokenConfig.operationId, apiContext.apiSpec);

    const [operationInputs, setOperationInputs] =
        useState<OperationInputs>(getOperationDefaultInputs(operation, undefined));

    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState<Problem | undefined>();

    if (!operation) {
        return null;
    }

    const onSubmit = () => {
        const parameterWithoutRequiredValue = operationInputs.parameters.find(p => {
            return !p.value && p.parameter.required;
        });

        if (parameterWithoutRequiredValue) {
            setProblem({
                status: 400,
                title: "You should fill in all the required fields",
            })
            return; // We don't execute the request if any parameter is missing its value.
        }

        setLoading(true);
        setProblem(undefined);

        OperationService.executeOperation(operationInputs, operation, apiContext.config, apiContext.extension)
            .then(response => {
                setProblem(undefined);
                setLoading(false);

                response.text()
                    .then(responseText => {
                        const { body, problem } = buildSuccessBodyOrProblem(response.status, responseText);

                        if (problem) {
                            setProblem(problem);
                        } else {
                            setProblem(undefined);
                            const accessToken = body[accessTokenConfig.responseAccessTokenPropertyName];
                            if (accessToken) {
                                onAccessToken(accessToken);
                            }
                        }
                    });
            })
            .catch(reason => {
                setProblem({
                    status: 500,
                    title: reason.message,
                });
                setLoading(false);
            })
    }

    return (
        <>
            <ResponsiveModal open={open} onClose={onClose}>
                <Typography level="title-lg">Authentication</Typography>
                <Typography level="title-md" sx={{mb: 2}}>{apiContext.apiSpec.document.info.title}</Typography>
                <OperationInputForm
                    operation={operation}
                    operationInputs={operationInputs}
                    onChange={input => {
                        setOperationInputs(input);
                    }}
                    onSubmit={onSubmit}
                    loading={loading}
                    apiContext={apiContext}/>
                {problem && <ProblemAlert problem={problem}/>}
            </ResponsiveModal>
        </>
    );
}