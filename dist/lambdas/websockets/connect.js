"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const responses_1 = require("../aws_components/responses");
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const userTable = process.env.userTable || '';
const locationTable = process.env.locationTable || '';
const handler = async (event) => {
    console.log('event:', event);
    const { connectionId: connectionID, domainName, stage } = event.requestContext;
    const dataMessage = {
        // we want the token and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        messages: [],
        domainName,
        stage,
    };
    const dataLocation = {
        // we want the token and geodata here then
        ID: connectionID,
        timeStamp: Date.now(),
        longitude: 0,
        latitude: 0,
        domainName,
        stage,
    };
    try {
        await dynamoDB_1.default.write(dataMessage, userTable);
        await dynamoDB_1.default.write(dataLocation, locationTable);
        return (0, responses_1._200)({ message: 'Connection established' });
    }
    catch (error) {
        console.error('Error in connect handler:', error);
        return (0, responses_1._500)({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.handler = handler;
//# sourceMappingURL=connect.js.map