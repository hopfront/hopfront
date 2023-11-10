import {OpenAPIV3} from "openapi-types";
import HttpMethods = OpenAPIV3.HttpMethods;
import OperationObject = OpenAPIV3.OperationObject;
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import slugify from "slugify";

export class StandaloneOperation {
    constructor(
        public apiSpec: ApiSpec,
        public path: string,
        public method: HttpMethods,
        public operation: OperationObject) {
    }

    /**
     * It's possible that operations don't have an operationId defined, so we build one if that's the case.
     */
    getOperationId(): string {
        if (this.operation.operationId) {
            return this.operation.operationId;
        } else if (this.operation.summary) {
            return slugify(this.operation.summary, {
                lower: true,
                strict: true
            });
        } else {
            return btoa(this.method + '-' + this.path);
        }
    }
}