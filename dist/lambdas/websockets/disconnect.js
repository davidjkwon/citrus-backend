"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const responses_1 = require("../aws_components/responses");
const dynamoDB_1 = __importDefault(require("../aws_components/dynamoDB"));
const userTable = process.env.userTable;
const locationTable = process.env.locationTable;
const handler = async (event) => {
    console.log('event:', event);
    const { connectionId: connectionID } = event.requestContext;
    if (!connectionID) {
        return (0, responses_1._500)({ message: 'No connection ID' });
    }
    await dynamoDB_1.default.delete(connectionID, userTable);
    await dynamoDB_1.default.delete(connectionID, locationTable);
    return (0, responses_1._200)({ message: 'disconnected' });
};
exports.handler = handler;
//# sourceMappingURL=disconnect.js.map