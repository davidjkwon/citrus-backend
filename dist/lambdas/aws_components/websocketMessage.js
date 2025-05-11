"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const create = (domainName, stage) => {
    const endpoint = `${domainName}/${stage}`;
    return new aws_sdk_1.default.ApiGatewayManagementApi({
        apiVersion: '2025-04-06',
        endpoint,
    });
};
const send = async ({ domainName, stage, connectionID, message }) => {
    const ws = create(domainName, stage);
    const postParams = {
        Data: message,
        ConnectionId: connectionID,
    };
    try {
        await ws.postToConnection(postParams).promise();
    }
    catch (error) {
        // Log the error or handle specific AWS SDK error cases
        if (error instanceof Error && error.name === 'GoneException') {
            // Connection is no longer available
            console.log(`Connection ${connectionID} is no longer active`);
        }
        else {
            // Rethrow other errors
            throw error;
        }
    }
};
exports.default = { send };
//# sourceMappingURL=websocketMessage.js.map