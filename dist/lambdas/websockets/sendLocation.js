"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const responses_1 = require("../aws_components/responses");
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const websocketMessage_1 = __importDefault(require("../aws_components/websocketMessage"));
const locationTable = process.env.locationTable;
const handler = async (event) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return (0, responses_1._500)({ message: 'No connection ID' });
    }
    const body = JSON.parse(event.body || '{}');
    try {
        const { longitude, latitude } = body;
        console.log('longitude:', longitude);
        if (!longitude || !latitude) {
            return (0, responses_1._400)({ message: 'Longitude and latitude are required' });
        }
        const record = await dynamoDB_1.default.get(connectionID, locationTable);
        const { domainName, stage } = record;
        // Update the record with the new location
        const data = {
            ...record,
            longitude: longitude,
            latitude: latitude,
            timeStamp: Date.now(),
        };
        await dynamoDB_1.default.write(data, locationTable);
        // Send a confirmation message back to the client
        await websocketMessage_1.default.send({
            domainName,
            stage,
            connectionID,
            message: 'Location updated successfully',
        });
        return (0, responses_1._200)({ message: 'Location updated successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        return (0, responses_1._400)({ message: 'Failed to update location' });
    }
};
exports.handler = handler;
//# sourceMappingURL=sendLocation.js.map