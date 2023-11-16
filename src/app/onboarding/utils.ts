import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";

export const buildFavoritePetSampleDashboard = (petstoreApiSpecId: string): Dashboard => {
    return {
        "id": "petstore-sample-dashboard-1",
        "title": "Petstore - Favorite Pet",
        "variables": [{
            "name": "favoritePetId",
            "foreignKeys": [{
                "apiSpecId": petstoreApiSpecId,
                "schemaRef": "#/components/schemas/Pet",
                "propertyName": "id"
            }],
            "label": "Favorite Pet 🐕"
        }],
        "panels": [{
            "id": "9yN",
            "title": "Favorite Pet",
            "type": "Visualization",
            "config": {
                "apiSpecId": petstoreApiSpecId,
                "operationId": "getPetById",
                "inputs": [{
                    "name": "petId",
                    "sourceConfig": {"type": "variable", "data": {"variableName": "favoritePetId"}}
                }]
            }
        }]
    };
};

export const buildPetOverviewDashboard = (petstoreApiSPecId: string): Dashboard => {
    return {
        "id": "petstore-sample-dashboard-2",
        "title": "Petstore - Overview",
        "variables": [],
        "panels": [{
            "id": "OD2",
            "title": "Inventory",
            "type": "Visualization",
            "config": {
                "apiSpecId": petstoreApiSPecId,
                "operationId": "getInventory",
                "inputs": []
            }
        }, {
            "id": "KKL",
            "title": "Available Pets",
            "type": "Visualization",
            "config": {
                "apiSpecId": petstoreApiSPecId,
                "operationId": "findPetsByStatus",
                "inputs": [{"name": "status", "sourceConfig": {"type": "constant", "data": {"value": "available"}}}]
            }
        }]
    };
}