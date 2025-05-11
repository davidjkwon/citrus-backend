"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const responses_1 = require("../aws_components/responses");
const handler = async (event) => {
    console.log('event:', event);
    return (0, responses_1._200)({ message: 'default' });
};
exports.handler = handler;
//# sourceMappingURL=default.js.map