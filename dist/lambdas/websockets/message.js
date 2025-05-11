"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const responses_1 = require("../aws_components/responses");
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const websocketMessage_1 = __importDefault(require("../aws_components/websocketMessage"));
const userTable = process.env.userTable;
const handler = async (event) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return (0, responses_1._500)({ message: 'No connection ID' });
    }
    const body = JSON.parse(event.body || '{}');
    try {
        const record = await dynamoDB_1.default.get(connectionID, userTable);
        const { messages, domainName, stage } = record;
        messages.push(body.message);
        const data = {
            ...record,
            messages: [body.message],
        };
        await dynamoDB_1.default.write(data, userTable);
        console.log('Sending WebSocket message...');
        console.log('connectionID:', connectionID);
        console.log('domainName:', domainName);
        console.log('stage:', stage);
        await websocketMessage_1.default.send({ domainName, stage, connectionID, message: "This is a reply" });
        console.log('Message sent successfully');
        return (0, responses_1._200)({ message: 'got a message' });
    }
    catch (error) {
        console.error('Error:', error);
        return (0, responses_1._400)({ message: 'no message' });
    }
};
exports.handler = handler;
//# sourceMappingURL=message.js.map